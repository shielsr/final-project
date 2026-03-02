from django.shortcuts import render

from django.conf import settings
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication

from .serializers import AudioSerializer
from .models import Audio


class DebugDisableAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        if settings.DEBUG and settings.DISABLE_AUTHENTICATION_WHEN_DEBUG:
            return (None, key)
        return super().authenticate_credentials(key)


class AudioView(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    queryset = Audio.objects.all()
    authentication_classes = [DebugDisableAuthentication]