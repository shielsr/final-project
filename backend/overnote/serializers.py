from rest_framework import serializers
from .models import Audio, Transcription

class TranscriptionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transcription
        fields = ('content', 'transcribed_at')

class AudioSerializer(serializers.HyperlinkedModelSerializer):
    transcription = TranscriptionSerializer(read_only=True)
    class Meta:
        model = Audio
        fields = ('id', 'title', 'description', 'duration', 'url', 'file_size', 'created_at', 'transcription')