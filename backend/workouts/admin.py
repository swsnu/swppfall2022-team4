from django.contrib import admin
from .models import FitElement, Routine, DailyLog

admin.site.register(FitElement)
admin.site.register(Routine)
admin.site.register(DailyLog)