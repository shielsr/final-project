from rest_framework import serializers
from .models import Audio, Transcription, Project, Category, SongwriterProfile

class TranscriptionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Transcription
        fields = ('content', 'transcribed_at')

class AudioSerializer(serializers.HyperlinkedModelSerializer):
    creator = serializers.PrimaryKeyRelatedField(read_only=True)
    project = serializers.PrimaryKeyRelatedField(queryset=Project.objects.all(), allow_null=True, required=False)
    creator_username = serializers.CharField(source='creator.username', read_only=True)
    categories = serializers.PrimaryKeyRelatedField(queryset=Category.objects.all(), many=True, required=False)

    class Meta:
        model = Audio
        fields = ('id', 'creator', 'creator_username', 'title', 'description', 'duration', 'url', 'file_size', 'created_at', 'project', 'categories')
        
class ProjectSerializer(serializers.ModelSerializer):
    owner_username = serializers.CharField(source='owner.username', read_only=True)
    class Meta:
        model = Project
        fields = ('id', 'title', 'description', 'created_at', 'owner_username')
        
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ('id', 'name', 'group')
        
class SongwriterProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = SongwriterProfile
        fields = ('id', 'bio', 'website', 'created_at')