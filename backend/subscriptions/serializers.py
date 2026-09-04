# subscriptions/serializers.py

from rest_framework import serializers
from .models import Subscription


class SubscriptionSerializer(serializers.ModelSerializer):
    is_premium_active = serializers.ReadOnlyField()

    class Meta:
        model = Subscription
        fields = ["plan", "started_at", "expires_at", "is_premium_active"]