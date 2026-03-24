from django.contrib import admin
from .models import Audio, Project, Transcription, CoWriter, SongwriterProfile, Category

admin.site.register(Audio)
admin.site.register(Project)
admin.site.register(Transcription)
admin.site.register(CoWriter)
admin.site.register(SongwriterProfile)

class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'group')

admin.site.register(Category, CategoryAdmin)