from django.db import models
from django.contrib.auth.models import AbstractBaseUser

# Create your models here.
class User(AbstractBaseUser):
    username = models.CharField(max_length=20, null=False)
    nickname = models.CharField(max_length=255, null=False)
    gender = models.CharField(max_length=1, null=False)
    age = models.IntegerField(null=False)
    height = models.FloatField(null=False)
    weight = models.FloatField(null=False)
    point = models.IntegerField(blank=True, null=True) # 경험치