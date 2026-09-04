from rest_framework import serializers
from .models import RevisionSuggestion

class RevisionSuggestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = RevisionSuggestion
        fields = '__all__'