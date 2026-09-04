# results/serializers.py

from rest_framework import serializers
from .models import AdmitCard, AnswerKey, Result


class AdmitCardSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    exam_authority = serializers.CharField(source='exam.conducting_authority', read_only=True)

    class Meta:
        model = AdmitCard
        fields = '__all__'


class AnswerKeySerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    exam_authority = serializers.CharField(source='exam.conducting_authority', read_only=True)

    class Meta:
        model = AnswerKey
        fields = '__all__'


class ResultSerializer(serializers.ModelSerializer):
    exam_name = serializers.CharField(source='exam.name', read_only=True)
    exam_authority = serializers.CharField(source='exam.conducting_authority', read_only=True)

    class Meta:
        model = Result
        fields = '__all__'