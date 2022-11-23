from django.contrib import admin
from informations.models import Information, YoutubeContent, ArticleContent


@admin.register(Information)
class InformationAdmin(admin.ModelAdmin):
    """Information admin definition"""

    list_display = ("pk", "name", "created", "updated")


@admin.register(YoutubeContent)
class YoutubeInformationAdmin(admin.ModelAdmin):
    """Youtube Information admin definition"""

    list_display = ("pk", "title", "channel", "published")


@admin.register(ArticleContent)
class ArticleInformationAdmin(admin.ModelAdmin):
    """Article Information admin definition"""

    list_display = ("pk",)
