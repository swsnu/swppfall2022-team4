from django.contrib import admin
from . import models


@admin.register(models.Information)
class InformationAdmin(admin.ModelAdmin):
    """Information admin definition"""

    list_display = (
        "pk",
        "name",
        "created",
    )


@admin.register(models.YoutubeContent)
class YoutubeInformationAdmin(admin.ModelAdmin):
    """Youtube Information admin definition"""

    list_display = ("pk",)


@admin.register(models.ArticleContent)
class ArticleInformationAdmin(admin.ModelAdmin):
    """Article Information admin definition"""

    list_display = ("pk",)
