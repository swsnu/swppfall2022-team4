from django.db import models

class Image(models.Model):
    title = models.CharField(max_length=16)
    file = models.ImageField(upload_to="")