from django.db import models

class User(models.Model):
    username = models.CharField(max_length=20, null=False)
    hashedPassword = models.CharField(max_length=255, null=False)
    nickname = models.CharField(max_length=8, null=False)
    gender = models.CharField(max_length=10, null=False)

    age = models.IntegerField(null=False)
    height = models.FloatField(null=False)
    weight = models.FloatField(null=False)

    image = models.CharField(max_length=255, null=False)

    exp = models.IntegerField(null = False)
    level = models.IntegerField(null = False)