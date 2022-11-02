from django.urls import path
from . import views

app_name = "comment"
urlpatterns = [
    path("", views.comment_home, name="commentHome"),
    path("<str:query_id>/", views.comment_detail, name="commentDetail"),
    # path("<str:query_id>/comment/", views.post_comment, name="postComment"),
]
