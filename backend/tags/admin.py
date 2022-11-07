from django.contrib import admin
from . import models


@admin.register(models.TagClass)
class TagClassAdmin(admin.ModelAdmin):
    """TagClass admin definition"""

    list_display = (
        "pk",
        "class_name",
        "color",
        "created",
    )


@admin.register(models.Tag)
class TagAdmin(admin.ModelAdmin):
    """Tag admin definition"""

    list_display = (
        "pk",
        "tag_class",
        "tag_name",
        "created",
    )
