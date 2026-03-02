from django.db import models

class Audio(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    duration = models.TextField()
    url = models.TextField()
    
    def __str__(self):
        return self.title