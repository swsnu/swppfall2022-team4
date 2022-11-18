from django.db import models
from utils.models import AbstractTimeStampedModel


class User(AbstractTimeStampedModel):
    LOGIN_EMAIL = "email"
    LOGIN_KAKAO = "kakao"
    LOGIN_GITHUB = "github"
    LOGIN_GOOGLE = "google"
    LOGIN_FACEBOOK = "facebook"

    LOGIN_CHOICES = (
        (LOGIN_EMAIL, "Email"),
        (LOGIN_KAKAO, "Kakao"),
        (LOGIN_GITHUB, "Github"),
        (LOGIN_GOOGLE, "Google"),
        (LOGIN_FACEBOOK, "Facebook"),
    )

    login_method = models.CharField(max_length=20, choices=LOGIN_CHOICES, default=LOGIN_EMAIL)
    validated = models.BooleanField(default=True)

    username = models.CharField(max_length=20, null=False)
    hashed_password = models.CharField(max_length=255, null=False)
    nickname = models.CharField(max_length=8, null=False)
    image = models.CharField(max_length=255, null=False)

    gender = models.CharField(max_length=10, null=False)
    height = models.FloatField(null=False)
    weight = models.FloatField(null=False)
    age = models.IntegerField(null=False)

    exp = models.IntegerField(null=False)
    level = models.IntegerField(null=False)

    follower = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='+')
    following = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='+')

    # Related_name : posts <- posts.Post
    # Related_name : comments <- comments.Comment
    # Related_name : liked_posts <- posts.Post
    # Related_name : disliked_posts <- posts.Post
    # Related_name : scraped_posts <- posts.Post
    # Related_name : liked_comments <- comments.Comment
    # Related_name : disliked_comments <- comments.Comment

    def __str__(self):
        return self.username
