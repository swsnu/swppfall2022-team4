from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User
from groups.models import Group

class Chatroom(AbstractTimeStampedModel):
    username1 = models.CharField(max_length=20)
    username2 = models.CharField(max_length=20)
    new1 = models.BooleanField(default=False)
    new2 = models.BooleanField(default=False)
    recent_message = models.CharField(max_length=255, default='')

class Message(AbstractTimeStampedModel):
    room = models.ForeignKey(Chatroom, on_delete=models.CASCADE, null=True)
    group = models.ForeignKey(Group, on_delete=models.CASCADE, null=True)
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    content = models.CharField(max_length=255)
