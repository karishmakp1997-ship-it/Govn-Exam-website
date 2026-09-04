# current_affairs/models.py

from django.db import models

class Article(models.Model):
    CATEGORY_CHOICES = [
        ('national', 'National'),
        ('international', 'International'),
        ('tamil_nadu', 'Tamil Nadu'),
        ('economy', 'Economy'),
        ('schemes', 'Government Schemes'),
        ('science_tech', 'Science & Technology'),
        ('environment', 'Environment'),
        ('awards', 'Awards'),
        ('appointments', 'Appointments'),
        ('sports', 'Sports'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    excerpt = models.CharField(max_length=500, blank=True)
    content = models.TextField(blank=True)
    published_at = models.DateTimeField(auto_now_add=True)

    # New fields for RSS + AI pipeline
    source_url = models.URLField(max_length=600, unique=True, null=True, blank=True)
    source_name = models.CharField(max_length=150, blank=True)
    ai_summary = models.TextField(blank=True)
    image_url = models.URLField(max_length=800, blank=True, null=True)
    exam_relevance = models.CharField(
        max_length=200, blank=True,
        help_text="Comma-separated: UPSC, TNPSC, SSC, Banking, Railways, Defence"
    )

    def __str__(self):
        return self.title