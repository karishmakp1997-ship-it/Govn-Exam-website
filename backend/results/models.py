from django.db import models
from exams.models import Exam

class AdmitCard(models.Model):
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, related_name='admit_card')
    reporting_time = models.CharField(max_length=100, blank=True)
    required_documents = models.TextField(blank=True, help_text="Comma-separated")
    allowed_items = models.TextField(blank=True)
    restricted_items = models.TextField(blank=True)
    exam_centre_info = models.TextField(blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    admit_card_file = models.FileField(upload_to='admit_cards/', null=True, blank=True)  

    def __str__(self):
        return f"Admit card - {self.exam.name}"


class AnswerKey(models.Model):
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, related_name='answer_key')
    released_at = models.DateTimeField(null=True, blank=True)
    objection_window_start = models.DateField(null=True, blank=True)
    objection_window_end = models.DateField(null=True, blank=True)
    official_link = models.URLField(blank=True)

    def __str__(self):
        return f"Answer key - {self.exam.name}"


class Result(models.Model):
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, related_name='result')
    released_at = models.DateTimeField(null=True, blank=True)
    next_stage_info = models.TextField(blank=True)
    cutoff_info = models.TextField(blank=True, help_text="Leave blank if not officially available")
    official_link = models.URLField(blank=True)

    def __str__(self):
        return f"Result - {self.exam.name}"