from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import TrackedExamViewSet, ReminderPreferenceView

router = DefaultRouter()
router.register(r'my-exams', TrackedExamViewSet, basename='my-exams')

urlpatterns = [
    path('', include(router.urls)),
    path('reminders/', ReminderPreferenceView.as_view(), name='reminders'),
]