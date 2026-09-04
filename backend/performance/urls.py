# performance/urls.py

from django.urls import path
from .views import PerformanceSummaryView, MarkRevisionDoneView

urlpatterns = [
    path('summary/', PerformanceSummaryView.as_view(), name='performance-summary'),
    path('revisions/<int:pk>/', MarkRevisionDoneView.as_view(), name='performance-revision-update'),
]