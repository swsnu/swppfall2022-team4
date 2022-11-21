from django.contrib import admin
from tags.models import TagClass, Tag


@admin.register(TagClass)
class TagClassAdmin(admin.ModelAdmin):
    """TagClass admin definition"""

    list_display = (
        "pk",
        "class_name",
        "class_type",
        "color",
        "created",
    )


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    """Tag admin definition"""

    list_display = (
        "pk",
        "tag_class",
        "tag_name",
        "created",
    )
