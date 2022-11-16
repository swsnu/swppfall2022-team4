from django.urls import path
from . import views

urlpatterns = [
    path('', views.index),
    path('<int:notification_id>/', views.delete_notification)
]
