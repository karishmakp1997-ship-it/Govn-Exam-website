# subscriptions/views.py

import razorpay
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Subscription
from .serializers import SubscriptionSerializer

PREMIUM_PRICE_PAISE = 499900  # ₹4,999 — Razorpay amounts are in paise (smallest unit)


def get_razorpay_client():
    return razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))


class SubscriptionStatusView(APIView):
    """GET /api/subscriptions/status/ — current user's plan info. Creates a free record if none exists."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        sub, _ = Subscription.objects.get_or_create(user=request.user)
        return Response(SubscriptionSerializer(sub).data)


class CreateOrderView(APIView):
    """POST /api/subscriptions/create-order/ — creates a Razorpay order for the Premium plan."""
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        client = get_razorpay_client()
        try:
            order = client.order.create({
                "amount": PREMIUM_PRICE_PAISE,
                "currency": "INR",
                "payment_capture": 1,
                "notes": {"user_id": str(request.user.id)},
            })
        except Exception as e:
            return Response({"detail": f"Failed to create order: {e}"}, status=502)

        return Response({
            "order_id": order["id"],
            "amount": PREMIUM_PRICE_PAISE,
            "currency": "INR",
            "key_id": settings.RAZORPAY_KEY_ID,  # public key, safe to send to frontend
        })


class VerifyPaymentView(APIView):
    """
    POST /api/subscriptions/verify-payment/
    Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
    Verifies the payment signature and activates Premium for 1 year on success.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        order_id = request.data.get("razorpay_order_id")
        payment_id = request.data.get("razorpay_payment_id")
        signature = request.data.get("razorpay_signature")

        if not all([order_id, payment_id, signature]):
            return Response({"detail": "Missing payment details."}, status=400)

        client = get_razorpay_client()
        try:
            client.utility.verify_payment_signature({
                "razorpay_order_id": order_id,
                "razorpay_payment_id": payment_id,
                "razorpay_signature": signature,
            })
        except razorpay.errors.SignatureVerificationError:
            return Response({"detail": "Payment verification failed."}, status=400)

        sub, _ = Subscription.objects.get_or_create(user=request.user)
        sub.activate_premium(order_id, payment_id, duration_days=365)

        return Response(SubscriptionSerializer(sub).data)