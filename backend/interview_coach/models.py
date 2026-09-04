from django.db import models
from django.conf import settings

class MockInterview(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mock_interviews')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    knowledge_score = models.IntegerField(null=True, blank=True)
    communication_score = models.IntegerField(null=True, blank=True)
    relevance_score = models.IntegerField(null=True, blank=True)
    confidence_score = models.IntegerField(null=True, blank=True)
    improvement_areas = models.TextField(blank=True)

    def __str__(self):
        return f"Interview - {self.user}"