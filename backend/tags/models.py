from django.db import models
from utils.models import AbstractTimeStampedModel


class TagClass(AbstractTimeStampedModel):
    class_name = models.CharField(max_length=10)
    color = models.CharField(max_length=7)


class Tag(AbstractTimeStampedModel):
    tag_name = models.CharField(max_length=10)
    tag_class = models.ForeignKey(
        TagClass, blank=True, null=True, on_delete=models.CASCADE, related_name="tags"
    )

    # Related_name : tagged_posts <- posts.Post

    def __str__(self):
        """To string method"""
        return str(self.tag_name)
