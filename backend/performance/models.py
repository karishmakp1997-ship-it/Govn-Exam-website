from django.db import models
from django.conf import settings

class RevisionSuggestion(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='revision_suggestions')
    subject = models.CharField(max_length=100)
    topic = models.CharField(max_length=150)
    reason = models.CharField(max_length=255)
    suggested_at = models.DateTimeField(auto_now_add=True)
    is_completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user} - {self.topic}"