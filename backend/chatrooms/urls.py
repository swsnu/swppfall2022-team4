from django.urls import path
from . import views

urlpatterns=[
    path('<str:user_id>/', views.chatroom),
    path('message/<int:room_id>/', views.message),
]
