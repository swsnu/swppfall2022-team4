from django.db import models
from users.models import User
from workouts.models import FitElement
from tags.models import Tag


class Group(models.Model):
    """group definition"""

    group_name = models.CharField(max_length=30, null=False)
    group_leader = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='own_group', null=False
    )
    members = models.ManyToManyField(User, related_name='group')
    number = models.IntegerField(null=True)
    member_number = models.IntegerField(default=0)
    start_date = models.DateField(null=True)
    end_date = models.DateField(null=True)
    description = models.TextField(blank=False)
    free = models.BooleanField(null=False)
    goal = models.ManyToManyField(FitElement, related_name='group_goal')
    lat = models.FloatField(null=True)
    lng = models.FloatField(null=True)
    address = models.CharField(max_length=30, null=True)

    tags = models.ManyToManyField(Tag, related_name="tagged_groups", blank=True)
    prime_tag = models.ForeignKey(
        Tag, related_name="prime_tagged_groups", on_delete=models.SET_NULL, blank=True, null=True
    )

    class Meta:
        ordering = ("-id",)


class GroupCert(models.Model):
    """Group Certification definition"""

    member = models.ForeignKey(User, on_delete=models.CASCADE, related_name='group_cert')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='group_cert')
    date = models.DateField(null=False)
    fit_element = models.ManyToManyField(FitElement, blank=True)

    def did(self):
        return self.fit_element.count() == self.group.goal.count()

class JoinRequest(models.Model):
    """ group join request """
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='join_request')
    members = models.ManyToManyField(User, related_name = 'join_request')
