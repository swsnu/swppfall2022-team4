from django.contrib import admin
from workouts.models import FitElement, Routine, DailyLog, DailyLogImage

admin.site.register(FitElement)
admin.site.register(Routine)
admin.site.register(DailyLog)
admin.site.register(DailyLogImage)
