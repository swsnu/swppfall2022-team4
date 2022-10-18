from django.urls import path

from . import views

urlpatterns = [  # pylint: disable=invalid-name
    path('group/all', views.group_list)
]