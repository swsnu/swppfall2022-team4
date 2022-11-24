from django.db import models
from utils.models import AbstractTimeStampedModel

TAG_TYPE_GENERAL = "general"
TAG_TYPE_WORKOUT = "workout"
TAG_TYPE_PLACE = "place"

TAG_TYPE_CHOICES = (
    (TAG_TYPE_GENERAL, "General"),
    (TAG_TYPE_WORKOUT, "Workout"),
    (TAG_TYPE_PLACE, "Place"),
)


class TagClass(AbstractTimeStampedModel):

    class_name = models.CharField(max_length=10)
    class_type = models.CharField(max_length=20, choices=TAG_TYPE_CHOICES, default=TAG_TYPE_GENERAL)
    color = models.CharField(max_length=7)

    def __str__(self):
        """To string method"""
        return str(self.class_name)


class Tag(AbstractTimeStampedModel):
    tag_name = models.CharField(max_length=10)
    tag_class = models.ForeignKey(
        TagClass, blank=True, null=True, on_delete=models.CASCADE, related_name="tags"
    )
    tag_type = models.CharField(max_length=20, choices=TAG_TYPE_CHOICES, default=TAG_TYPE_GENERAL)
    calories = models.FloatField(null=True)
    # Related_name : tagged_posts <- posts.Post

    def __str__(self):
        """To string method"""
        return str(self.tag_name)
