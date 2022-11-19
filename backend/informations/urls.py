from django.urls import path
from informations.views import information_detail, information_update

app_name = "information"
urlpatterns = [
    path("<str:information_name>/", information_detail, name="informationDetail"),
    path("<str:information_name/update/", information_update, name="informationUpdate"),
]
