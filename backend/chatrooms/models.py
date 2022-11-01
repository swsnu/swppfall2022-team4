from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User

class Chatroom(models.Model):
    username1 = models.CharField(max_length=20)
    username2 = models.CharField(max_length=20)

class Message(AbstractTimeStampedModel):
    room = models.ForeignKey(Chatroom, on_delete=models.CASCADE)
    # group = models.ForeignKey(Group, on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.CharField(max_length=255)
