from django.db import models
from utils.models import AbstractTimeStampedModel


class YoutubeContent(AbstractTimeStampedModel):
    pass


class ArticleContent(AbstractTimeStampedModel):
    pass


class Information(AbstractTimeStampedModel):
    # created, updated.
    name = models.CharField(max_length=15)

    youtube_info = models.ManyToManyField(YoutubeContent, related_name="information", blank=True)
    article_info = models.ManyToManyField(ArticleContent, related_name="information", blank=True)

    def __str__(self):
        """To string method"""
        return str(self.name)
