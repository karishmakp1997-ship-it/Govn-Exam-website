from django.db import models

class Exam(models.Model):
    STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('notification_released', 'Notification Released'),
        ('application_open', 'Application Open'),
        ('application_closed', 'Application Closed'),
        ('exam_scheduled', 'Exam Scheduled'),
        ('result_released', 'Result Released'),
    ]

    name = models.CharField(max_length=255)
    conducting_authority = models.CharField(max_length=255)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='upcoming')
    qualification_required = models.CharField(max_length=255)
    age_limit_min = models.IntegerField(null=True, blank=True)
    age_limit_max = models.IntegerField(null=True, blank=True)
    application_fee = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)
    vacancy_count = models.IntegerField(null=True, blank=True)
    application_start_date = models.DateField(null=True, blank=True)
    application_end_date = models.DateField(null=True, blank=True)
    exam_date = models.DateField(null=True, blank=True)
    official_notification_url = models.URLField(blank=True)
    last_verified_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name