from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """User admin definition"""
    list_display = (
        "id",
        "username",
        "nickname",
        "gender",
        "height",
        "weight",
        "age",
        "exp",
        "level"
    )