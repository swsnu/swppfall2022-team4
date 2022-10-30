from django.urls import path
from . import views

app_name = "comment"
urlpatterns = [
    path("", views.comment_home, name="postHome"),
    # path("<str:query_id>/", views.post_detail, name="postDetail"),
    # path("<str:query_id>/comment/", views.post_comment, name="postComment"),
]
