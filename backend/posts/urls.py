from django.urls import path
from posts.views import post_home, post_detail, post_func, post_comment

app_name = "post"
urlpatterns = [
    path("", post_home, name="postHome"),
    path("<str:query_id>/", post_detail, name="postDetail"),
    path("<str:query_id>/func/", post_func, name="postFunc"),
    path("<str:query_id>/comment/", post_comment, name="postComment"),
]
