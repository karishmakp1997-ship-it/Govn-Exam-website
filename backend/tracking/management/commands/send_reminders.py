from datetime import timedelta
from django.core.management.base import BaseCommand
from django.utils import timezone
from django.conf import settings
import requests as http_requests

from tracking.models import TrackedExam, ReminderPreference


def send_reminder_email(email, username, exam_name, days_left, deadline_date):
    subject = f"Reminder: {exam_name} application closes in {days_left} day{'s' if days_left != 1 else ''}"
    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
        <h2 style="color: #1e1b4b;">Hi {username},</h2>
        <p>This is a reminder that the application deadline for <strong>{exam_name}</strong> is coming up:</p>
        <p style="font-size: 20px; font-weight: 800; color: #7c3aed;">{days_left} day{'s' if days_left != 1 else ''} left</p>
        <p style="color: #64748b; font-size: 13px;">Application closes on {deadline_date.strftime('%d %B %Y')}.</p>
        <p style="color: #64748b; font-size: 13px;">Log in to Vetri AI Coach to complete your application before the deadline.</p>
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


class Command(BaseCommand):
    help = "Send exam deadline reminder emails to users based on their reminder preferences (run daily via a scheduled job)."

    def handle(self, *args, **options):
        today = timezone.localdate()

        # Which preference field corresponds to which day-count
        day_options = [
            (14, "remind_14_days"),
            (7, "remind_7_days"),
            (3, "remind_3_days"),
            (1, "remind_1_day"),
        ]

        tracked_exams = TrackedExam.objects.select_related("user", "exam").exclude(
            exam__application_end_date__isnull=True
        )

        sent_count = 0
        skipped_count = 0

        for tracked in tracked_exams:
            deadline = tracked.exam.application_end_date
            days_left = (deadline - today).days

            # Only fire on an exact match to one of the reminder windows
            matching_day_field = None
            for days, field_name in day_options:
                if days_left == days:
                    matching_day_field = field_name
                    break

            if matching_day_field is None:
                skipped_count += 1
                continue

            try:
                prefs = tracked.user.reminder_preference
            except ReminderPreference.DoesNotExist:
                skipped_count += 1
                continue

            if not getattr(prefs, matching_day_field, False):
                skipped_count += 1
                continue

            if not tracked.user.email:
                skipped_count += 1
                continue

            try:
                send_reminder_email(
                    email=tracked.user.email,
                    username=tracked.user.username,
                    exam_name=tracked.exam.name,
                    days_left=days_left,
                    deadline_date=deadline,
                )
                sent_count += 1
                self.stdout.write(self.style.SUCCESS(
                    f"Sent reminder to {tracked.user.email} for {tracked.exam.name} ({days_left} days left)"
                ))
            except Exception as e:
                self.stdout.write(self.style.ERROR(
                    f"Failed to send reminder to {tracked.user.email} for {tracked.exam.name}: {e}"
                ))

        self.stdout.write(self.style.SUCCESS(
            f"Done. Sent: {sent_count}, Skipped: {skipped_count}, Total tracked exams checked: {tracked_exams.count()}"
        ))