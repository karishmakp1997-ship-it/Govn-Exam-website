
from django.urls import path
from .views import SubscriptionStatusView, CreateOrderView, VerifyPaymentView

urlpatterns = [
    path("status/", SubscriptionStatusView.as_view(), name="subscription-status"),
    path("create-order/", CreateOrderView.as_view(), name="subscription-create-order"),
    path("verify-payment/", VerifyPaymentView.as_view(), name="subscription-verify-payment"),
]

