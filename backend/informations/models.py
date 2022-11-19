from django.db import models
from utils.models import AbstractTimeStampedModel
from tags.models import Tag


class Information(AbstractTimeStampedModel):
    # created, updated.
    name = models.CharField(max_length=15)

    # youtube_info = models.ManyToManyField(YoutubeContent, related_name="information", blank=True)
    # article_info = models.ManyToManyField(ArticleContent, related_name="information", blank=True)

    tag = models.ForeignKey(Tag, related_name="information", on_delete=models.CASCADE, null=True)

    def __str__(self):
        """To string method"""
        return str(self.name)


class YoutubeContent(AbstractTimeStampedModel):
    information = models.ForeignKey(
        Information, on_delete=models.CASCADE, related_name="youtube", null=True
    )
    video_id = models.CharField(max_length=50, null=False, default="")
    title = models.CharField(max_length=100, null=False, default="")
    thumbnail = models.CharField(max_length=100, null=False, default="")
    channel = models.CharField(max_length=50, null=False, default="")
    published = models.DateTimeField(null=True)


class ArticleContent(AbstractTimeStampedModel):
    pass
