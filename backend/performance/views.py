# performance/views.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, permissions
from .analytics import get_accuracy_over_time, get_subject_mastery, get_overall_stats
from .ai_insight import generate_performance_insight
from .models import RevisionSuggestion
from .serializers import RevisionSuggestionSerializer


class PerformanceSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        subject_mastery = get_subject_mastery(request.user)

        # Auto-create revision suggestions for weak subjects (accuracy < 60%) not already suggested
        existing_subjects = set(
            RevisionSuggestion.objects.filter(user=request.user, is_completed=False)
            .values_list("subject", flat=True)
        )
        for s in subject_mastery:
            if s["accuracy"] < 60 and s["subject"] not in existing_subjects:
                RevisionSuggestion.objects.create(
                    user=request.user,
                    subject=s["subject"],
                    topic=s["subject"],
                    reason=f"Accuracy is {s['accuracy']}%, below the 60% target.",
                )

        revision_suggestions = RevisionSuggestion.objects.filter(
            user=request.user, is_completed=False
        ).order_by("-suggested_at")[:5]

        return Response({
            "overall_stats": get_overall_stats(request.user),
            "accuracy_over_time": get_accuracy_over_time(request.user),
            "subject_mastery": subject_mastery,
            "ai_insight": generate_performance_insight(subject_mastery),
            "revision_suggestions": RevisionSuggestionSerializer(revision_suggestions, many=True).data,
        })


class MarkRevisionDoneView(generics.UpdateAPIView):
    """PATCH /api/performance/revisions/<id>/  { "is_completed": true }"""
    serializer_class = RevisionSuggestionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return RevisionSuggestion.objects.filter(user=self.request.user)