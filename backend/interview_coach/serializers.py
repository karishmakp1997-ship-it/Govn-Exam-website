from rest_framework import serializers
from .models import MockInterview

class MockInterviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = MockInterview
        fields = '__all__'
        read_only_fields = ['user']