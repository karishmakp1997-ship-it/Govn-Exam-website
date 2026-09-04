from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RequestSignupOTP, VerifySignupOTP

urlpatterns = [
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("login/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("signup/request-otp/", RequestSignupOTP.as_view()),
    path("signup/verify-otp/", VerifySignupOTP.as_view()),
]