from django.urls import path
from informations.views import information_detail

app_name = "information"
urlpatterns = [
    path("<str:information_name>/", information_detail, name="informationDetail"),
]
