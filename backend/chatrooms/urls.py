from django.urls import path
from . import views

urlpatterns=[
    path('', views.chatroom),
    path('read/<int:room_id>/', views.read_chatroom),
    path('<int:room_id>/', views.message),
    path('group/<int:group_id>/', views.group_message),
]
