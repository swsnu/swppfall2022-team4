from django.urls import path
from . import views

urlpatterns=[
    path('token/', views.set_csrf),

    path('signup/', views.signup),
    path('login/', views.login),
    path('check/', views.check),
]
