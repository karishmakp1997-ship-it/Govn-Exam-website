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
        ('previous_year', 'Previous Year Question Papers'),
    ]

    # Two-tier access model:
    # - free: anyone can access, no login needed (Previous Year Papers are always forced to this tier)
    # - premium: login required AND an active Premium subscription
    ACCESS_CHOICES = [
        ('free', 'Free — no login required'),
        ('premium', 'Premium — login + active subscription required'),
    ]

    title = models.CharField(max_length=255)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    material_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    subject = models.CharField(max_length=255, blank=True)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='materials/', null=True, blank=True)
    size_or_duration = models.CharField(max_length=100, blank=True, help_text="e.g. 24 pages, 32 min, 40 cards")
    access_level = models.CharField(
        max_length=10,
        choices=ACCESS_CHOICES,
        default='premium',
        help_text="'free' = visible and downloadable by anyone, no login needed. "
                   "'premium' = requires login AND an active Premium subscription. "
                   "Previous Year Question Papers are always forced to 'free' automatically."
    )
    is_featured = models.BooleanField(default=False, help_text="Show as featured/highlighted material")
    last_updated = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        # Previous Year Question Papers must always be free, per platform policy —
        # enforced here so it can never be accidentally set to premium in admin.
        if self.material_type == 'previous_year':
            self.access_level = 'free'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title