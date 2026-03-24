"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""


from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path, re_path
from django.views.static import serve

from rest_framework import routers
from overnote import views

router = routers.DefaultRouter()
router.register(r"audiofiles", views.AudioView, "audio")
router.register(r"projects", views.ProjectView, "project")
router.register(r"transcriptions", views.TranscriptionView, "transcription")
router.register(r"categories", views.CategoryView, "category")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
    path('api/auth/', include('authentication.urls')),
    path("api/transcribe/", views.transcribe_audio), # For the Django-based Assembly AI transcriptions
    re_path(r"^$", serve, kwargs={"path": "index.html", "document_root": settings.STATIC_ROOT}),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)