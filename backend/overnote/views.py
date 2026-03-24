from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
import assemblyai as aai
from django.conf import settings
from django.db import models
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication

from .serializers import AudioSerializer, ProjectSerializer, TranscriptionSerializer
from .models import Audio, Transcription, Project, CoWriter



class DebugDisableAuthentication(TokenAuthentication):
    def authenticate_credentials(self, key):
        if settings.DEBUG and settings.DISABLE_AUTHENTICATION_WHEN_DEBUG:
            return (None, key)
        return super().authenticate_credentials(key)

class AudioView(viewsets.ModelViewSet):
    serializer_class = AudioSerializer
    authentication_classes = [JWTAuthentication]        
        
    def get_queryset(self):
        user = self.request.user
        project_id = self.request.query_params.get('project')
        
        if project_id:
            return Audio.objects.filter(project__id=project_id)
        
        return Audio.objects.filter(
            models.Q(creator=user) |
            models.Q(project__cowriters=user)
        ).distinct()
            
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
 

        
class ProjectView(viewsets.ModelViewSet):
    serializer_class = ProjectSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(
            models.Q(owner=user) |
            models.Q(cowriters=user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
        
    @action(detail=True, methods=['get'])
    def cowriters(self, request, pk=None):
        project = self.get_object()
        cowriters = CoWriter.objects.filter(project=project).select_related('user')
        return Response([{'id': cw.user.id, 'username': cw.user.username} for cw in cowriters])
        
    @action(detail=True, methods=['post'])
    def add_cowriter(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        try:
            user = User.objects.get(id=user_id)
            CoWriter.objects.get_or_create(project=project, user=user)
            return Response({'status': 'cowriter added'})
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=400)

    @action(detail=True, methods=['post'])
    def remove_cowriter(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        CoWriter.objects.filter(project=project, user__id=user_id).delete()
        return Response({'status': 'cowriter removed'})
    
   
class TranscriptionView(viewsets.ReadOnlyModelViewSet):
    serializer_class = TranscriptionSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        audio_id = self.request.query_params.get('audio')
        return Transcription.objects.filter(audio__id=audio_id)
    
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