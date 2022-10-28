from django.contrib import admin
from comments import admin as comment_admin
from . import models

@admin.register(models.Post)
class PostAdmin(admin.ModelAdmin):
    """Post admin definition"""

    list_display = ("pk", "author", "title", "created", "get_eff_like", "scrap_num")
    # list_display = ("pk", "author", "title", "view_num", "created", "get_eff_like", "scrap_num")

    inlines = (comment_admin.CommentInlineAdmin,)
