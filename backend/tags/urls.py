from django.urls import path
from tags.views import tag_home, tag_class, tag_search

app_name = "tag"
urlpatterns = [
    path("", tag_home, name="tagHome"),
    path("class/", tag_class, name="tagClass"),
    path("search/", tag_search, name="tagSearch"),
]
