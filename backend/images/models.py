from django.db import models

class Image(models.Model):
    title = models.CharField(max_length=30)
    file = models.ImageField(upload_to="")