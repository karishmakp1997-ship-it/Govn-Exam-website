from rest_framework.routers import DefaultRouter
from .views import StudyMaterialViewSet

router = DefaultRouter()
router.register('materials', StudyMaterialViewSet, basename='studymaterial')

urlpatterns = router.urls