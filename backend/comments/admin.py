from django.contrib import admin
from comments.models import Comment


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    """Comment admin definition"""

    def get_post_name(self, obj):
        """Get post name to display"""
        return str(obj.post)

    def get_author_name(self, obj):
        """Get author name to display"""
        return str(obj.author)

    list_display = (
        "pk",
        "get_post_name",
        "get_author_name",
        "get_eff_like",
        "content",
        "created",
    )


class CommentInlineAdmin(admin.TabularInline):
    """Comment Inline admin"""

    model = Comment
    verbose_name = "Comment"
    verbose_name_plural = "Comments"
