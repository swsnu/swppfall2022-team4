from django.urls import path
from . import views

urlpatterns = [
    path('', views.general_group, name = "groups"),
    path('<int:group_id>/', views.group_detail, name = "group"),
    path('<int:group_id>/member/', views.group_members, name = "group_members"),
    path('<int:group_id>/member/<str:member>/', views.group_member, name = "group_member"),
    path('<int:group_id>/mem_check/', views.group_member_check, name = "group_member_check")
]
