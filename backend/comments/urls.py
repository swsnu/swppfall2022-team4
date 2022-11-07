from django.urls import path
from . import views

app_name = "comment"
urlpatterns = [
    path("", views.comment_home, name="commentHome"),
    path("recent/", views.recent_comment, name="commentRecent"),
    path("<str:query_id>/", views.comment_detail, name="commentDetail"),
    path("<str:query_id>/func/", views.comment_func, name="commentFunc"),
]
