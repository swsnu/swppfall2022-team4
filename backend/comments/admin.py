from django.contrib import admin
from . import models

@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):
    """Comment admin definition"""

    def get_post_name(self, obj):
        """Get post name to display"""
        return obj.post.__str__()
    def get_author_name(self, obj):
        """Get author name to display"""
        return obj.author.__str__()

    list_display = ("pk", "get_post_name", "get_author_name" ,"get_eff_like", "content", "created")


class CommentInlineAdmin(admin.TabularInline):
    """Comment Inline admin"""

    model = models.Comment
    verbose_name = "Comment"
    verbose_name_plural = "Comments"
