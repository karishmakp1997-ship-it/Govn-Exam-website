from rest_framework import viewsets, generics, permissions
from .models import TrackedExam, ReminderPreference
from .serializers import TrackedExamSerializer, ReminderPreferenceSerializer

class TrackedExamViewSet(viewsets.ModelViewSet):
    serializer_class = TrackedExamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrackedExam.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ReminderPreferenceView(generics.RetrieveUpdateAPIView):
    serializer_class = ReminderPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        obj, created = ReminderPreference.objects.get_or_create(user=self.request.user)
        return obj