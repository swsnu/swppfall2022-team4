from django.contrib import admin
from workouts.models import FitElement, Routine, DailyLog, DailyLogImage

admin.site.register(DailyLog)
admin.site.register(DailyLogImage)


@admin.register(FitElement)
class FitElementAdmin(admin.ModelAdmin):
    """FitElement admin definition"""

    list_display = (
        "pk",
        "author",
        "workout_type",
        "period",
        "weight",
        "rep",
        "set",
        "time",
        "date",
    )


@admin.register(Routine)
class RoutineAdmin(admin.ModelAdmin):
    """Routine admin definition"""

    list_display = (
        "pk",
        "author",
        "name",
        "calories",
    )
