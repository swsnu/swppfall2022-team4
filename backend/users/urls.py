from django.urls import path
from users import views

urlpatterns = [
    path('token/', views.set_csrf),
    path('signup/', views.signup),
    path('login/kakao/callback/', views.kakao_callback, name='kakao_callback'),
    path('login/', views.login),
    path('check/', views.check),
    path('logout/', views.logout),
    path('profile/<str:user_id>/', views.profile),
    path('profile/<str:user_id>/content/', views.profile_post),
]
