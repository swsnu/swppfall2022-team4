from django.urls import path
from . import views

app_name = "comment"
urlpatterns = [
    path("", views.tag_home, name="tagHome"),
    path("class/", views.tag_class, name="tagClass"),
    # path("<str:query_id>/", views.comment_detail, name="commentDetail"),
    # path("<str:query_id>/func/", views.comment_func, name="commentFunc"),
]
