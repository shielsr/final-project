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
    cowriters = models.ManyToManyField(User, through='CoWriter', related_name='cowriting_projects', blank=True)
    title = models.CharField(default='my project', max_length=120)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Category(models.Model):
    GROUP_CHOICES = [
        ('type', 'Type'),
        ('section', 'Section'),
    ]
    name = models.CharField(max_length=50)
    group = models.CharField(max_length=20, choices=GROUP_CHOICES)

    def __str__(self):
        return self.name
        
class Audio(models.Model):
    creator = models.ForeignKey(User, on_delete=models.CASCADE, related_name='audios', default=1)
    title = models.CharField(default='my audio', max_length=120)
    description = models.TextField(blank=True)
    duration = models.IntegerField(null=True, blank=True)  # seconds as a number
    url = models.URLField(default='')  # Cloudinary URL
    project = models.ForeignKey(Project, on_delete=models.SET_NULL, null=True, blank=True, related_name='audios')
    file_size = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now)
    categories = models.ManyToManyField(Category, blank=True, related_name='audios')
    def __str__(self):
        return self.title
    
class CoWriter(models.Model):
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=100, blank=True)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} on {self.project.title}"
    
class Transcription(models.Model):
    audio = models.OneToOneField(Audio, on_delete=models.CASCADE, related_name='transcription')
    content = models.TextField(blank=True)
    transcribed_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Transcription for {self.audio.title}"
    
