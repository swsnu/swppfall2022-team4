from django.db import models
from utils.models import AbstractTimeStampedModel
from users.models import User
from groups.models import Group

class Notification(AbstractTimeStampedModel):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    category = models.CharField(max_length=255, null=False)
    content = models.CharField(max_length=255, null=False)
    image = models.CharField(max_length=255, null=False)
    link = models.CharField(max_length=255, null=False)
