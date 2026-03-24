from rest_framework import serializers
from .models import Audio, Transcription, Project

class TranscriptionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transcription
        fields = ('content', 'transcribed_at')

class AudioSerializer(serializers.HyperlinkedModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), allow_null=True, required=False)
    class Meta:
        model = Audio
        fields = ('id', 'creator', 'title', 'description', 'duration', 'url', 'file_size', 'created_at', 'project')
        
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'created_at')