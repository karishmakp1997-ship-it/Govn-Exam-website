# mock_tests/models.py — restored to match the original migration exactly

from django.db import models
from django.conf import settings
from exams.models import Exam


class TestSeries(models.Model):
    TEST_TYPE_CHOICES = [
        ('topic', 'Topic Test'),
        ('subject', 'Subject Test'),
        ('sectional', 'Sectional Test'),
        ('full_mock', 'Full Mock Test'),
    ]
    title = models.CharField(max_length=255)
    test_type = models.CharField(max_length=20, choices=TEST_TYPE_CHOICES)
    duration_minutes = models.IntegerField(default=60)
    negative_marking = models.BooleanField(default=True)
    negative_mark_value = models.DecimalField(max_digits=4, decimal_places=2, default=0.25)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='test_series')

    def __str__(self):
        return self.title

    @property
    def total_questions(self):
        return self.questions.count()


class TestAttempt(models.Model):
    started_at = models.DateTimeField(auto_now_add=True)
    submitted_at = models.DateTimeField(null=True, blank=True)
    score = models.DecimalField(max_digits=6, decimal_places=2, null=True, blank=True)
    accuracy = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    is_submitted = models.BooleanField(default=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='test_attempts')
    test_series = models.ForeignKey(TestSeries, on_delete=models.CASCADE, related_name='attempts')

    class Meta:
        ordering = ['-started_at']


class Question(models.Model):
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=150, blank=True)
    text = models.TextField()
    option_a = models.CharField(max_length=500)
    option_b = models.CharField(max_length=500)
    option_c = models.CharField(max_length=500)
    option_d = models.CharField(max_length=500)
    correct_option = models.CharField(max_length=1, choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')])
    explanation = models.TextField(blank=True)
    test_series = models.ForeignKey(TestSeries, on_delete=models.CASCADE, related_name='questions')

    def __str__(self):
        return f"{self.test_series.title} - {self.subject}"


class Answer(models.Model):
    selected_option = models.CharField(max_length=1, choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')], null=True, blank=True)
    marked_for_review = models.BooleanField(default=False)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    attempt = models.ForeignKey(TestAttempt, on_delete=models.CASCADE, related_name='answers')

    class Meta:
        unique_together = ('attempt', 'question')