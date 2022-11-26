from django.urls import path
from comments.views import comment_home, recent_comment, comment_detail, comment_func

app_name = "comment"
urlpatterns = [
    path("", comment_home, name="commentHome"),
    path("recent/", recent_comment, name="commentRecent"),
    path("<str:query_id>/", comment_detail, name="commentDetail"),
    path("<str:query_id>/func/", comment_func, name="commentFunc"),
]
