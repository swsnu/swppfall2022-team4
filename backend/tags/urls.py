from django.urls import path
from . import views

app_name = "tag"
urlpatterns = [
    path("", views.tag_home, name="tagHome"),
    path("class/", views.tag_class, name="tagClass"),
    path("search/", views.tag_search, name="tagSearch"),
]
