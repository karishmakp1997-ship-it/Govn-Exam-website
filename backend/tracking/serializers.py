from rest_framework import serializers
from .models import TrackedExam, ReminderPreference
from exams.serializers import ExamSerializer

class TrackedExamSerializer(serializers.ModelSerializer):
    exam_detail = ExamSerializer(source='exam', read_only=True)

    class Meta:
        model = TrackedExam
        fields = ['id', 'exam', 'exam_detail', 'status', 'added_at']

class ReminderPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReminderPreference
        fields = ['remind_14_days', 'remind_7_days', 'remind_3_days', 'remind_1_day']