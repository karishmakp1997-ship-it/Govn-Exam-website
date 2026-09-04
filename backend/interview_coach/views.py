# interview_coach/views.py

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from .models import MockInterview
from .serializers import MockInterviewSerializer
from .ai_analyzer import analyze_interview


class MyInterviewsView(generics.ListCreateAPIView):
    serializer_class = MockInterviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return MockInterview.objects.filter(user=self.request.user).order_by('-started_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class AnalyzeInterviewView(APIView):
    """
    POST /api/interview-coach/analyze/
    Body: { "transcript": [ { "question": "...", "answer": "..." }, ... ] }
    Analyzes the full interview with AI, saves a MockInterview record, and returns it.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        transcript = request.data.get("transcript", [])
        if not transcript:
            return Response({"detail": "Transcript is required."}, status=400)

        result = analyze_interview(transcript)

        interview = MockInterview.objects.create(
            user=request.user,
            completed_at=timezone.now(),
            knowledge_score=result["knowledge_score"],
            communication_score=result["communication_score"],
            relevance_score=result["relevance_score"],
            confidence_score=result["confidence_score"],
            improvement_areas=result["improvement_areas"],
        )

        return Response(MockInterviewSerializer(interview).data)