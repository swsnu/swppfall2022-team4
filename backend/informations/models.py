from django.db import models
from utils.models import AbstractTimeStampedModel
from tags.models import Tag


class YoutubeContent(AbstractTimeStampedModel):
    pass


class ArticleContent(AbstractTimeStampedModel):
    pass


class Information(AbstractTimeStampedModel):
    # created, updated.
    name = models.CharField(max_length=15)

    youtube_info = models.ManyToManyField(YoutubeContent, related_name="information", blank=True)
    article_info = models.ManyToManyField(ArticleContent, related_name="information", blank=True)

    tag = models.ForeignKey(Tag, related_name="information", on_delete=models.CASCADE)

    def __str__(self):
        """To string method"""
        return str(self.name)
