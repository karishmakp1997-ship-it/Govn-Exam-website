# subscriptions/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Subscription(models.Model):
    PLAN_CHOICES = [
        ("free", "Free"),
        ("premium", "Premium"),
    ]

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="subscription")
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default="free")
    started_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    razorpay_order_id = models.CharField(max_length=100, blank=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.user} - {self.plan}"

    @property
    def is_premium_active(self):
        if self.plan != "premium":
            return False
        if not self.expires_at:
            return False
        return timezone.now() < self.expires_at

    def activate_premium(self, order_id, payment_id, duration_days=365):
        self.plan = "premium"
        self.started_at = timezone.now()
        self.expires_at = timezone.now() + timedelta(days=duration_days)
        self.razorpay_order_id = order_id
        self.razorpay_payment_id = payment_id
        self.save()