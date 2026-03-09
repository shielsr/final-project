from django.shortcuts import render

# Create your views here.

import assemblyai as aai
from django.conf import settings
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import AudioSerializer
from .models import Audio, Transcription



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
    audio_id = request.data.get('audio_id')

    if not audio_url:
        return Response({'error': 'No URL provided'}, status=400)

    aai.settings.api_key = settings.ASSEMBLYAI_API_KEY
    aai.settings.base_url = "https://api.eu.assemblyai.com"

    config = aai.TranscriptionConfig(
        speech_models=["universal-3-pro", "universal-2"],
        language_detection=True,
        speaker_labels=True,
    )

    try:
        transcriber = aai.Transcriber()
        result = transcriber.transcribe(audio_url, config=config)
        if result.error:
            return Response({'error': result.error}, status=500)

        if audio_id:
            audio = Audio.objects.get(id=audio_id)
            Transcription.objects.update_or_create(
                audio=audio,
                defaults={'content': result.text}
            )

        return Response({'transcription': result.text})
    except Exception as e:
        return Response({'error': str(e)}, status=500)