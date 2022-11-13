from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User
from posts.models import Post


class Comment(AbstractTimeStampedModel):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="comments")

    content = models.TextField()

    liker = models.ManyToManyField(User, related_name="liked_comments", blank=True)
    disliker = models.ManyToManyField(
        User, related_name="disliked_comments", blank=True
    )
    scraper = models.ManyToManyField(User, related_name="scraped_comments", blank=True)

    # Related_name : comments <- comments.Comment

    parent_comment = models.ForeignKey(
        "self", on_delete=models.CASCADE, blank=True, null=True
    )

    def get_like_num(self):
        """Get number of like"""
        return self.liker.count()

    def get_dislike_num(self):
        """Get number of dislike"""
        return self.disliker.count()

    def get_eff_like(self):
        """Get effective number of like"""
        return self.get_like_num() - self.get_dislike_num()

    def __str__(self):
        """To string method"""
        return str(self.content)
