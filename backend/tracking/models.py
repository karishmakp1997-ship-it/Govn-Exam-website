from django.db import models
from django.conf import settings
from exams.models import Exam

class TrackedExam(models.Model):
    STATUS_CHOICES = [
        ('not_applied', 'Not Applied'),
        ('planning', 'Planning to Apply'),
        ('applied', 'Applied'),
        ('admit_card_awaited', 'Admit Card Awaited'),
        ('exam_completed', 'Exam Completed'),
        ('result_awaited', 'Result Awaited'),
        ('qualified', 'Qualified'),
        ('not_qualified', 'Not Qualified'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tracked_exams')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='tracked_by')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='not_applied')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'exam')

    def __str__(self):
        return f"{self.user} - {self.exam.name}"


class ReminderPreference(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reminder_preference')
    remind_14_days = models.BooleanField(default=True)
    remind_7_days = models.BooleanField(default=True)
    remind_3_days = models.BooleanField(default=True)
    remind_1_day = models.BooleanField(default=True)

    def __str__(self):
        return f"Reminder settings for {self.user}"