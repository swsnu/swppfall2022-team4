from django.urls import path
from users import views

urlpatterns = [
    path('token/', views.set_csrf),
    path('signup/', views.signup),
    path('login/kakao/callback/', views.kakao_callback, name='kakao_callback'),
    path('signup/social/validate/', views.validate_social_account, name='social_validate'),
    path('login/', views.login),
    path('check/', views.check),
    path('logout/', views.logout),
    path('profile/<str:user_id>/', views.profile),
    path('follow/<str:user_id>/', views.follow),
]
