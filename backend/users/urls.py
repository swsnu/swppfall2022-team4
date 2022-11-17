from django.urls import path
from . import views

urlpatterns = [
    path('token/', views.set_csrf),
    path('signup/', views.signup),
    path('login/', views.login),
    path('check/', views.check),
    path('logout/', views.logout),
    path('profile/<str:user_id>/', views.profile),
    path('follow/<str:user_id>/', views.follow),
]
