from django.urls import path
from . import views

app_name = "post"
urlpatterns = [
    path("", views.postHome, name="postHome"),
    path("<str:id>/", views.postDetail, name="postDetail"),
    path("<str:id>/comment/", views.postComment, name="postComment")
]