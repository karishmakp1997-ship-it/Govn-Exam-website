from django.urls import path
from .views import CheckEligibilityView

urlpatterns = [
    path('check/', CheckEligibilityView.as_view(), name='check-eligibility'),
]