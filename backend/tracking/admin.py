from django.contrib import admin
from .models import TrackedExam, ReminderPreference

admin.site.register(TrackedExam)
admin.site.register(ReminderPreference)