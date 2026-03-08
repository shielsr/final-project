from rest_framework import serializers
from .models import Audio

class AudioSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Audio
        fields = ('id', 'title', 'description', 'duration', 'url', 'file_size', 'created_at')