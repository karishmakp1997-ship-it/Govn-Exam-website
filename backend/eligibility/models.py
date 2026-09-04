from django.db import models
from exams.models import Exam

class EligibilityRule(models.Model):
    exam = models.OneToOneField(Exam, on_delete=models.CASCADE, related_name='eligibility_rule')
    allowed_qualifications = models.CharField(max_length=500, help_text="Comma-separated, e.g. B.Sc,B.A,B.Com")
    min_age = models.IntegerField(null=True, blank=True)
    max_age = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Eligibility rule for {self.exam.name}"