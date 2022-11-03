from django.db import models
from utils.models import AbstractTimeStampedModel


class TagClass(AbstractTimeStampedModel):
    string = models.CharField(max_length=10)
    color = models.CharField(max_length=7)


class Tag(AbstractTimeStampedModel):
    name = models.CharField(max_length=10)
    tag_class = models.ForeignKey(TagClass, blank=True, on_delete=models.CASCADE)

    def __str__(self):
        """To string method"""
        return str(self.name)
