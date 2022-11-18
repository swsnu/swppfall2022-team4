from django.contrib import admin
from users.models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    """User admin definition"""

    list_display = (
        "pk",
        "username",
        "nickname",
        "created",
        "image",
        "gender",
        "height",
        "weight",
        "age",
        "level",
        "exp",
        "login_method",
    )
