from django.db import models
from users.models import User


class FitElement(models.Model):
    """ fit element definition """
    TYPE_CHOICE = (
        ('goal', 'goal'),
        ('log', 'log')
    )
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='fit_element')
    type = models.CharField(
        max_length=4, choices=TYPE_CHOICE, null=False)  # goal / log
    workout_type = models.CharField(max_length=30, null=False)  # 운동종류
    period = models.IntegerField(null=True)
    category = models.CharField(max_length=30, null=True)  # 하체, 등 카테고리
    weight = models.IntegerField(null=True)
    rep = models.IntegerField(null=True)
    set = models.IntegerField(null=True)
    time = models.IntegerField(null=True)
    date = models.DateField(null=True)


class DailyLog(models.Model):
    """ daily log definition """
    date = models.DateField(null=False)
    memo = models.TextField(null=True)
    fit_element = models.ManyToManyField(FitElement, blank=True)


class Routine(models.Model):
    """ routine definition """
    name = models.CharField(max_length=30, null=False)
    author = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='routine')
    fit_element = models.ManyToManyField(FitElement, blank=True)
