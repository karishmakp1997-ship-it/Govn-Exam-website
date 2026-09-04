from django.db import models

class StudyMaterial(models.Model):
    CATEGORY_CHOICES = [
        ('upsc', 'UPSC'),
        ('tnpsc_group1', 'TNPSC Group 1'),
        ('tnpsc_group2', 'TNPSC Group 2'),
        ('tnpsc_group3', 'TNPSC Group 3'),
        ('tnpsc_group4', 'TNPSC Group 4'),
        ('railways', 'Railways (RRB)'),
        ('ssc', 'SSC'),
        ('banking', 'Banking'),
        ('defence', 'Defence'),
        ('teaching', 'Teaching'),
        ('psus', 'PSUs & Others'),
    ]

    TYPE_CHOICES = [
        ('notes', 'Notes'),
        ('pdf', 'PDF'),
        ('video', 'Video'),
        ('flashcards', 'Flashcards'),
        ('current_affairs', 'Current Affairs'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    material_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    subject = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='materials/', null=True, blank=True)
    size_or_duration = models.CharField(max_length=100, blank=True, help_text="e.g. 24 pages, 32 min, 40 cards")
    is_locked = models.BooleanField(default=True, help_text="If True, login required to access")
    is_featured = models.BooleanField(default=False, help_text="Show as featured/highlighted material")
    last_updated = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title