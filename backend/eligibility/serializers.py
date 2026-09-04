from rest_framework import serializers
from .models import EligibilityRule

class EligibilityRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EligibilityRule
        fields = '__all__'

class EligibilityCheckInputSerializer(serializers.Serializer):
    exam_id = serializers.IntegerField()
    qualification = serializers.CharField()
    age = serializers.IntegerField()