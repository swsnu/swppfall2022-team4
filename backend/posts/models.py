from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User
from tags.models import Tag


class Post(AbstractTimeStampedModel):
    """Post model definition"""

    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posts")
    title = models.CharField(max_length=60, null=False)
    content = models.TextField()

    liker = models.ManyToManyField(User, related_name="liked_posts", blank=True)
    disliker = models.ManyToManyField(User, related_name="disliked_posts", blank=True)
    scraper = models.ManyToManyField(User, related_name="scraped_posts", blank=True)

    tags = models.ManyToManyField(Tag, related_name="tagged_posts", blank=True)
    prime_tag = models.ForeignKey(
        Tag, related_name="prime_tagged_posts", on_delete=models.SET_NULL, blank=True, null=True
    )

    # Related_name : comments <- comments.Comment
    def get_like_num(self):
        """Get number of like"""
        return self.liker.count()

    def get_dislike_num(self):
        """Get number of dislike"""
        return self.disliker.count()

    def get_scrap_num(self):
        """Get number of scrap"""
        return self.scraper.count()

    def get_eff_like(self):
        """Get effective number of like"""
        return self.get_like_num() - self.get_dislike_num()

    def get_comments_num(self):
        """Get the number of comments"""
        return self.comments.count()

    def __str__(self):
        """To string method"""
        return str(self.title)

    class Meta:
        ordering = ("-created",)
