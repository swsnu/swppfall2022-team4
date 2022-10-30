from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User


class Post(AbstractTimeStampedModel):
    """Post model definition"""

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=60, null=False)
    content = models.TextField()

    # view_num = models.IntegerField(null=False, default=0)
    like_num = models.IntegerField(null=False, default=0)
    dislike_num = models.IntegerField(null=False, default=0)
    scrap_num = models.IntegerField(null=False, default=0)

    # Related_name : comments <- comments.Comment
    def get_eff_like(self):
        """Get effective number of like"""
        return self.like_num - self.dislike_num

    def get_comments_num(self):
        """Get the number of comments"""
        return self.comments.count()

    def __str__(self):
        """To string method"""
        return str(self.title)

    class Meta:
        ordering = ("-created",)
