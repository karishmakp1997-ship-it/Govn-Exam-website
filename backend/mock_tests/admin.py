from django.contrib import admin
from .models import TestSeries, Question, TestAttempt, Answer

admin.site.register(TestSeries)
admin.site.register(Question)
admin.site.register(TestAttempt)
admin.site.register(Answer)