# mock_tests/serializers.py

from rest_framework import serializers
from .models import TestSeries, TestAttempt, Question, Answer


class TestSeriesListSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    total_questions = serializers.ReadOnlyField()

    class Meta:
        model = TestSeries
        fields = [
            'id', 'title', 'test_type', 'exam_name', 'duration_minutes',
            'negative_marking', 'negative_mark_value', 'total_questions',
        ]


class QuestionForTakingSerializer(serializers.ModelSerializer):
    """Correct answer and explanation are NEVER sent while the test is in progress."""
    class Meta:
        model = Question
        fields = ['id', 'subject', 'topic', 'text', 'option_a', 'option_b', 'option_c', 'option_d']


class TestSeriesDetailSerializer(serializers.ModelSerializer):
    questions = QuestionForTakingSerializer(many=True, read_only=True)
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    total_questions = serializers.ReadOnlyField()

    class Meta:
        model = TestSeries
        fields = [
            'id', 'title', 'test_type', 'exam_name', 'duration_minutes',
            'negative_marking', 'negative_mark_value', 'total_questions', 'questions',
        ]


class TestAttemptSerializer(serializers.ModelSerializer):
    test_series_title = serializers.CharField(source='test_series.title', read_only=True)

    class Meta:
        model = TestAttempt
        fields = [
            'id', 'test_series_title', 'started_at', 'submitted_at',
            'score', 'accuracy', 'is_submitted',
        ]