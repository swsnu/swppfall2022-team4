from io import open_code
from tkinter import CASCADE
from django.db import models

from users.models import User

# Create your models here.
class Group(models.Model):
    group_name = models.CharField(max_length=20, null=False)
    users = models.ManyToManyField('users.User', related_name='group_member')
    # Field

class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
    title = models.CharField(max_length=255, null=False)
    content = models.TextField()
    date = models.DateTimeField(db_index=True)
    likes = models.IntegerField(null=False)
    post_type = models.CharField(max_length=20, null=False)
    # Field

class WorkoutLog(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    year = models.IntegerField(null=False)
    month = models.IntegerField(null=False)
    date = models.IntegerField(null=False)

class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, db_index=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    date = models.DateTimeField(db_index=True)