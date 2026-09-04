from rest_framework import viewsets, permissions
from .models import AdmitCard, AnswerKey, Result
from .serializers import AdmitCardSerializer, AnswerKeySerializer, ResultSerializer

class AdmitCardViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AdmitCard.objects.all()
    serializer_class = AdmitCardSerializer
    permission_classes = [permissions.AllowAny]


class AnswerKeyViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AnswerKey.objects.all()
    serializer_class = AnswerKeySerializer
    permission_classes = [permissions.AllowAny]


class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Result.objects.all()
    serializer_class = ResultSerializer
    permission_classes = [permissions.AllowAny]