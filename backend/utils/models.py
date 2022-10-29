from django.db import models

# Create your models here.
class AbstractTimeStampedModel(models.Model):
    """ Abstract Model with Time Stamps"""

    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True