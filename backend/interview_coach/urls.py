# interview_coach/urls.py

from django.urls import path
from .views import MyInterviewsView, AnalyzeInterviewView

urlpatterns = [
    path('my-interviews/', MyInterviewsView.as_view(), name='my-interviews'),
    path('analyze/', AnalyzeInterviewView.as_view(), name='interview-analyze'),
]