from django.shortcuts import render

# Create your views here.
from django.contrib.auth.models import User
import assemblyai as aai
from django.conf import settings
from django.db import models
from rest_framework import viewsets
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import api_view, action, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import IsAuthenticated

from .serializers import AudioSerializer, ProjectSerializer, TranscriptionSerializer, CategorySerializer, SongwriterProfileSerializer
from .models import Audio, Transcription, Project, CoWriter, Category, SongwriterProfile

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
            return Audio.objects.filter(project__id=project_id).order_by('-created_at')
        
        return Audio.objects.filter(
            models.Q(creator=user) |
            models.Q(project__cowriters=user) |
            models.Q(project__owner=user) 
        ).distinct().order_by('-created_at')
            
    def perform_create(self, serializer):
        serializer.save(creator=self.request.user)
    
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)
    

        
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
    

class CategoryView(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    queryset = Category.objects.all()
    

    
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def search(request):
    query = request.query_params.get('q', '')
    
    if not query or len(query) < 2:
        return Response({'audio': [], 'projects': [], 'transcriptions': []})
    
    user = request.user
    
    # Search audio files the user has access to
    audio_results = Audio.objects.filter(
        models.Q(creator=user) |
        models.Q(project__cowriters=user) |
        models.Q(project__owner=user)
    ).filter(
        models.Q(title__icontains=query) |
        models.Q(description__icontains=query)
    ).distinct()

    # Search projects the user has access to
    project_results = Project.objects.filter(
        models.Q(owner=user) |
        models.Q(cowriters=user)
    ).filter(
        models.Q(title__icontains=query) |
        models.Q(description__icontains=query)
    ).distinct()

    # Search transcriptions for audio the user has access to
    transcription_results = Transcription.objects.filter(
        models.Q(audio__creator=user) |
        models.Q(audio__project__cowriters=user) |
        models.Q(audio__project__owner=user)
    ).filter(
        content__icontains=query
    ).distinct()

    return Response({
        'audio': [{'id': a.id, 'title': a.title} for a in audio_results],
        'projects': [{'id': p.id, 'title': p.title} for p in project_results],
        'transcriptions': [{'id': t.audio.id, 'title': t.audio.title, 'excerpt': t.content[:100]} for t in transcription_results],
    })
    

class SongwriterProfileView(viewsets.ModelViewSet):
    serializer_class = SongwriterProfileSerializer
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        return SongwriterProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)