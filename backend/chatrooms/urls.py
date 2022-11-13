from django.urls import path
from . import views

urlpatterns=[
    path('', views.chatroom),
    path('<int:room_id>/', views.message),
]
