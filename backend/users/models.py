import random
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta


class User(AbstractUser):
    mobile_number = models.CharField(max_length=15, blank=True, null=True, unique=True)
    is_verified = models.BooleanField(default=False)


class PendingSignup(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField(blank=True)
    mobile_number = models.CharField(max_length=15, unique=True)
    password_hash = models.CharField(max_length=255)
    otp_code = models.CharField(max_length=6)
    otp_created_at = models.DateTimeField(auto_now=True)
    attempts = models.IntegerField(default=0)

    OTP_VALID_MINUTES = 5
    MAX_ATTEMPTS = 5

    def is_expired(self):
        return timezone.now() > self.otp_created_at + timedelta(minutes=self.OTP_VALID_MINUTES)

    @staticmethod
    def generate_otp():
        return str(random.randint(100000, 999999))