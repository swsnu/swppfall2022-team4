from django.contrib import admin
from groups.models import Group


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    """Group admin definition"""

    list_display = ("pk", "group_name", "group_leader", "address")
