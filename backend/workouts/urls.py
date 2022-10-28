from django.urls import path
from . import views

urlpatterns = [
    path('fitelement/', views.create_fit_element, name='fitelements'),
    path('fitelement/:fitelement_id/', views.fit_element, name='fitelement'),
    path('fitelement/:year/:month/', views.get_calendar_info, name='calendar_info'),
    path('routine/', views.routines, name='routines'),
    path('routine/:routine_id', views.routine, name='routine'),
    path('dailylog/:year/:month/:date', views.daily_log, name='daily_log')
]