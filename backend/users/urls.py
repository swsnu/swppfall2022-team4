from django.urls import path
from . import views

urlpatterns=[
    path('signup/', views.signup),
    path('login/', views.login),
    path('check/', views.check),
]
