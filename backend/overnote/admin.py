from django.contrib import admin
from .models import Audio, Project, Transcription, CoWriter, SongwriterProfile

admin.site.register(Audio)
admin.site.register(Project)
admin.site.register(Transcription)
admin.site.register(CoWriter)
admin.site.register(SongwriterProfile)