# ai_coach/serializers.py

from rest_framework import serializers


class ChatMessageSerializer(serializers.Serializer):
    message = serializers.CharField()
    history = serializers.ListField(
        child=serializers.DictField(), required=False, default=list
    )