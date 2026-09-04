# mock_tests/urls.py

from django.urls import path
from .views import TestSeriesListView, TestSeriesDetailView, TestSeriesSubmitView, RecentAttemptsView

urlpatterns = [
    path('', TestSeriesListView.as_view(), name='test-series-list'),
    path('attempts/', RecentAttemptsView.as_view(), name='test-series-attempts'),
    path('<int:pk>/', TestSeriesDetailView.as_view(), name='test-series-detail'),
    path('<int:pk>/submit/', TestSeriesSubmitView.as_view(), name='test-series-submit'),
]