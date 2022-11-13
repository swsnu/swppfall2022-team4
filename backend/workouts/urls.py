from django.urls import path
from . import views

urlpatterns = [
    path('', views.create_fit_element, name='fitelements'),
    path('<int:fitelement_id>/', views.fit_element, name='fitelement'),
    path('<int:year>/<int:month>/', views.get_calendar_info, name='calendar_info'),
    path('routine/', views.routines, name='routines'),
    path('routine/<int:routine_id>/', views.routine, name='routine'),
    path('dailylog/<int:year>/<int:month>/<int:specific_date>/', views.daily_log, name='daily_log')
]
