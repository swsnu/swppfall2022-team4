from django.contrib import admin
from .models import FitElement, Routine, DailyLog, FitElementType

admin.site.register(FitElement)
admin.site.register(Routine)
admin.site.register(DailyLog)
admin.site.register(FitElementType)
