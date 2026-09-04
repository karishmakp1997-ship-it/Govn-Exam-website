# mock_tests/views.py

from django.utils import timezone
from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import TestSeries, TestAttempt, Question, Answer
from .serializers import TestSeriesListSerializer, TestSeriesDetailSerializer, TestAttemptSerializer


class TestSeriesListView(generics.ListAPIView):
    """GET /api/mock-tests/  — optional ?test_type=topic|subject|sectional|full_mock"""
    serializer_class = TestSeriesListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        qs = TestSeries.objects.all()
        test_type = self.request.query_params.get('test_type')
        if test_type:
            qs = qs.filter(test_type=test_type)
        return qs


class TestSeriesDetailView(generics.RetrieveAPIView):
    """
    GET /api/mock-tests/<id>/  — questions WITHOUT correct answers. Requires login.
    Creates (or resumes) a TestAttempt for this user so started_at is recorded.
    """
    queryset = TestSeries.objects.all()
    serializer_class = TestSeriesDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        test_series = self.get_object()
        # Resume an unsubmitted attempt if one exists, else start a new one
        attempt, _ = TestAttempt.objects.get_or_create(
            user=request.user, test_series=test_series, is_submitted=False,
        )
        request.session['current_attempt_id'] = attempt.id  # not strictly needed but handy for debugging
        serializer = self.get_serializer(test_series)
        data = serializer.data
        data['attempt_id'] = attempt.id
        return Response(data)


class RecentAttemptsView(generics.ListAPIView):
    """GET /api/mock-tests/attempts/  — the logged-in user's submitted attempts, most recent first."""
    serializer_class = TestAttemptSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TestAttempt.objects.filter(user=self.request.user, is_submitted=True)[:10]


class TestSeriesSubmitView(APIView):
    """
    POST /api/mock-tests/<id>/submit/
    Body: { "attempt_id": <id>, "answers": { "<question_id>": "a"|"b"|"c"|"d"|null, ... } }
    Scores server-side, saves Answer rows, finalizes the TestAttempt.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        try:
            test_series = TestSeries.objects.get(pk=pk)
        except TestSeries.DoesNotExist:
            return Response({'detail': 'Test not found.'}, status=404)

        attempt_id = request.data.get('attempt_id')
        answers_payload = request.data.get('answers', {})

        try:
            attempt = TestAttempt.objects.get(pk=attempt_id, user=request.user, test_series=test_series)
        except TestAttempt.DoesNotExist:
            return Response({'detail': 'No matching attempt found. Reload the test and try again.'}, status=404)

        if attempt.is_submitted:
            return Response({'detail': 'This attempt was already submitted.'}, status=400)

        questions = test_series.questions.all()
        correct_count = 0
        wrong_count = 0
        unattempted_count = 0
        score = 0
        breakdown = []

        for q in questions:
            selected = answers_payload.get(str(q.id))

            Answer.objects.update_or_create(
                attempt=attempt, question=q,
                defaults={'selected_option': selected},
            )

            if not selected:
                unattempted_count += 1
                status_label = 'unattempted'
            elif selected == q.correct_option:
                correct_count += 1
                score += 1
                status_label = 'correct'
            else:
                wrong_count += 1
                if test_series.negative_marking:
                    score -= float(test_series.negative_mark_value)
                status_label = 'wrong'

            breakdown.append({
                'question_id': q.id,
                'selected': selected,
                'correct_option': q.correct_option,
                'explanation': q.explanation,
                'status': status_label,
            })

        attempted = correct_count + wrong_count
        accuracy = round((correct_count / attempted) * 100, 2) if attempted else 0

        attempt.score = round(score, 2)
        attempt.accuracy = accuracy
        attempt.is_submitted = True
        attempt.submitted_at = timezone.now()
        attempt.save()

        return Response({
            'test_series': test_series.title,
            'total_questions': questions.count(),
            'correct_count': correct_count,
            'wrong_count': wrong_count,
            'unattempted_count': unattempted_count,
            'score': attempt.score,
            'accuracy': accuracy,
            'breakdown': breakdown,
        })