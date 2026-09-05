from django.contrib.auth import get_user_model
User = get_user_model()
from django.contrib.auth.hashers import make_password
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from .models import PendingSignup
import requests as http_requests

def send_otp_email(email, otp, username):
    subject = "Your Vetri AI Coach verification code"
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e1b4b;">Hi {username},</h2>
        <p>Your OTP for signing up on <strong>Vetri AI Coach</strong> is:</p>
        <p style="font-size: 32px; font-weight: 800; letter-spacing: 4px; color: #7c3aed;">{otp}</p>
        <p style="color: #64748b; font-size: 13px;">This code is valid for 5 minutes. If you didn't request this, please ignore this email.</p>
        <p style="color: #94a3b8; font-size: 12px;">— Team Vetri AI Coach</p>
    </div>
    """

    response = http_requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "from": "Vetri AI Coach <onboarding@resend.dev>",
            "to": [email],
            "subject": subject,
            "html": html_body,
        },
        timeout=10,
    )

    if response.status_code >= 400:
        raise Exception(f"Resend API error: {response.status_code} {response.text}")


class RequestSignupOTP(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username")
        email = request.data.get("email", "")
        mobile_number = request.data.get("mobile_number")
        password = request.data.get("password")

        if not username or not email or not mobile_number or not password:
            return Response({"detail": "username, email, mobile_number, password required."}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Username already taken."}, status=400)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "Email already registered."}, status=400)

        otp = PendingSignup.generate_otp()
        pending, _ = PendingSignup.objects.update_or_create(
            mobile_number=mobile_number,
            defaults={"username": username, "email": email,
                      "password_hash": make_password(password), "otp_code": otp, "attempts": 0},
        )

        try:
            send_otp_email(email, otp, username)
        except Exception as e:
            # Email failed to send (bad SMTP creds, network issue, etc.)
            return Response({"detail": f"Could not send OTP email. Please try again. ({str(e)})"}, status=500)

        return Response({"detail": "OTP sent to your email.", "mobile_number": mobile_number, "email": email})


class VerifySignupOTP(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        mobile_number = request.data.get("mobile_number")
        otp = request.data.get("otp")

        try:
            pending = PendingSignup.objects.get(mobile_number=mobile_number)
        except PendingSignup.DoesNotExist:
            return Response({"detail": "No pending signup found."}, status=404)

        if pending.is_expired():
            return Response({"detail": "OTP expired."}, status=400)
        if pending.attempts >= PendingSignup.MAX_ATTEMPTS:
            return Response({"detail": "Too many attempts."}, status=429)
        if pending.otp_code != otp:
            pending.attempts += 1
            pending.save()
            return Response({"detail": "Incorrect OTP."}, status=400)

        user = User(username=pending.username, email=pending.email)
        user.password = pending.password_hash
        user.save()
        pending.delete()

        refresh = RefreshToken.for_user(user)
        return Response({"access": str(refresh.access_token), "refresh": str(refresh)})