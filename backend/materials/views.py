from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from .models import StudyMaterial
from .serializers import StudyMaterialSerializer

class StudyMaterialViewSet(viewsets.ModelViewSet):
    queryset = StudyMaterial.objects.all().order_by('-last_updated')
    serializer_class = StudyMaterialSerializer
    permission_classes = [AllowAny]  # locking is handled on frontend via is_locked + login state
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['category', 'material_type', 'is_featured']