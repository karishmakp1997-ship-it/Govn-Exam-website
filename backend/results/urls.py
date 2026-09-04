from rest_framework.routers import DefaultRouter
from .views import AdmitCardViewSet, AnswerKeyViewSet, ResultViewSet

router = DefaultRouter()
router.register(r'admit-cards', AdmitCardViewSet)
router.register(r'answer-keys', AnswerKeyViewSet)
router.register(r'results', ResultViewSet)

urlpatterns = router.urls