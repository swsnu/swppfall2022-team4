from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest

from datetime import datetime, date
from models import FitElement, Routine, DailyLog

def create_fit_element(request):
    pass


def fit_element(request, fit_element_id):
    pass


def get_calendar_info(request, year, month):
    if request.method == 'GET':
        user = request.user
        return_json = []
        this_month = datetime(year, month, 1).date()
        if month == 12:
            next_month = datetime(year+1, 1, 1).date()
        else:
            next_month = datetime(year, month+1, 1).date()
        for i in range(1, 32):
            dict = {
                "year": year,
                "month": month,
                "date": i,
                "workouts": []
            }
            return_json.append(dict)
        workouts = (FitElement.objects
                    .filter(author=user)
                    .filter(date__gte=this_month, date__lt=next_month))
        for workout in workouts:
            workout_dict = {
                'id': workout.id,
                'author': workout.author.id, # id or name
                'type': workout.type,
                'workout_type': workout.workout_type,
                'period': workout.period,
                'category': workout.category,
                'weight': workout.weight,
                'rep': workout.rep,
                'set': workout.set,
                'time': workout.time,
                'date': workout.date
            }
            return_json[int(workout_dict['date'].day) -
                        1]['workouts'].append(workout_dict)
        return JsonResponse(return_json, safe=False, status=200)
    else:
        return HttpResponseNotAllowed(['GET'])


def routines(request):
    pass


def routine(request, routine_id):
    pass


def daily_log(request, year, month, date):
    pass
