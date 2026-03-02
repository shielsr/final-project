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
<<<<<<< HEAD



from django.contrib import admin
from django.urls import include, path
from rest_framework import routers

from undernote import views

router = routers.DefaultRouter()
router.register(r"audios", views.AudioView, "audio")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
=======
from django.contrib import admin
from django.urls import path

urlpatterns = [
    path('admin/', admin.site.urls),
]
>>>>>>> 3dce6d8e3e680d3bcf44e6fc4bbfe2207a5519ad
