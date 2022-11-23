from django.contrib import admin
from .models import Chatroom, Message

@admin.register(Chatroom)
class ChatroomAdmin(admin.ModelAdmin):
    """Chatroom admin definition"""
    list_display = (
        "id",
        "username1",
        "username2",
        "new1",
        "new2",
        "recent_message"
    )

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    """Message admin definition"""
    list_display = (
        "id",
        "room",
        "group",
        "author",
        "content",
    )
