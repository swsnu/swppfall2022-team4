from django.db import models
from users.models import User
from workouts.models import FitElement

class Group(models.Model):
    """ group definition """
    group_name = models.CharField(max_length = 30, null = False)
    group_leader = models.ForeignKey(
        User, on_delete = models.CASCADE, related_name = 'own_group', null = False)
    members = models.ManyToManyField(User, related_name = 'group')
    number = models. IntegerField(null = True)
    start_date = models.DateField(null = True)
    end_date = models.DateField(null = True)
    description = models.TextField(blank = False)
    free = models.BooleanField(null = False)

class Goal(models.Model):
    """ group goal definition """
    group_id = models.ForeignKey(Group, on_delete = models.CASCADE, related_name = 'goal')
    fit_element = models.ManyToManyField(FitElement, related_name = 'group_goal')
