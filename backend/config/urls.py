from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('exams.urls')),
    path('api/eligibility/', include('eligibility.urls')),
    path('api/auth/', include('users.urls')),
    path('api/', include('tracking.urls')),
    path('api/mock-tests/', include('mock_tests.urls')),
    path('api/performance/', include('performance.urls')),
    path('api/', include('results.urls')),
    path('api/interview-coach/', include('interview_coach.urls')),
    path('api/current-affairs/', include('current_affairs.urls')),
    path('api/ai-coach/', include('ai_coach.urls')),
    path("api/subscriptions/", include("subscriptions.urls")),
    path('api/', include('materials.urls')),  

]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)