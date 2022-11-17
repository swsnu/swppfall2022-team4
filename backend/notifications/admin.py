from django.contrib import admin
from .models import Notification

@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Message admin definition"""
    list_display = (
        "id",
        "user",
        "category",
        "content",
        "image",
        "link"
    )
