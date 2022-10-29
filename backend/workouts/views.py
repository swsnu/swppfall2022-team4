from unicodedata import category
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest

from datetime import datetime, date
from .models import FitElement, Routine, DailyLog
import json


def create_fit_element(request):
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            new_fit_element = FitElement(
                author_id=req_data["user_id"],
                type=req_data["type"],
                workout_type=req_data["workout_type"],
                period=req_data["period"],
                category=req_data["category"],
                weight=req_data["weight"],
                rep=req_data["rep"],
                set=req_data["set"],
                time=req_data["time"],
                date=req_data["date"]
            )

            new_fit_element.save()
            return HttpResponse(status=201)
        except:
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['POST'])


def fit_element(request, fit_element_id):
    if request.method == 'GET':
        try:
            workout = FitElement.objects.get(id=fit_element_id)
            return_json = {
                'id': workout.id,
                'author': workout.author.id,  # id or name
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
            return JsonResponse(return_json, safe=False, status=201)
        except:
            return HttpResponse(404)
    else:
        return HttpResponseNotAllowed(['GET'])


def get_calendar_info(request, year, month):
    if request.method == 'GET':
        req_data = json.loads(request.body.decode())
        user_id = req_data['user_id']

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
        workouts_all = FitElement.objects.filter(
            date__gte=this_month, date__lt=next_month)

        workouts = workouts_all.filter(author_id=user_id)

        for workout in workouts:
            workout_dict = {
                'id': workout.id,
                'author': workout.author.id,  # id or name
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
