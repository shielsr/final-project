from django.shortcuts import render

# Create your views here.

import assemblyai as aai
from django.conf import settings
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response

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
    
@api_view(['POST'])
def transcribe_audio(request):
    audio_url = request.data.get('url')
    if not audio_url:
        return Response({'error': 'No URL provided'}, status=400)

    aai.settings.api_key = settings.ASSEMBLYAI_API_KEY
    aai.settings.base_url = "https://api.eu.assemblyai.com"

    config = aai.TranscriptionConfig(
        speech_model=aai.SpeechModel.universal,  
        language_detection=True,
        speaker_labels=True,
    )

    try:
        transcriber = aai.Transcriber()
        transcript = transcriber.transcribe(audio_url, config=config)
        if transcript.error:
            return Response({'error': transcript.error}, status=500)
        return Response({'transcript': transcript.text})
    except Exception as e:
        return Response({'error': str(e)}, status=500)