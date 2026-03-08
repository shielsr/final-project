from django.db import models

class Audio(models.Model):
    title = models.CharField(default='my audio', max_length=120)
    description = models.TextField(blank=True)
    duration = models.IntegerField(null=True, blank=True)  # seconds as a number
    url = models.URLField(default='')  # Cloudinary URL

    def __str__(self):
        return self.title