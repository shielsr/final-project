from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class SongwriterProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True)
    website = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.user.username}'s profile"
    
class Project(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='projects')
    title = models.CharField(default='my project', max_length=120)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class Audio(models.Model):
    title = models.CharField(default='my audio', max_length=120)
    description = models.TextField(blank=True)
    duration = models.IntegerField(null=True, blank=True)  # seconds as a number
    url = models.URLField(default='')  # Cloudinary URL
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='audios')
    file_size = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    def __str__(self):
        return self.title

