from unicodedata import category
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest

from datetime import datetime, date
from .models import FitElement, Routine, DailyLog
import json
from django.views.decorators.http import require_http_methods


@require_http_methods(["POST"])
def create_fit_element(request):
    """create fit element"""
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


@require_http_methods(["GET"])
def fit_element(request, fit_element_id):
    """get a fit element"""
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


@require_http_methods(["GET"])
def get_calendar_info(request, year, month):
    """get fit elements for calendar"""
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


@require_http_methods(["GET"])
def routines(request):
    """get routines"""
    if request.method == 'GET':
        req_data = json.loads(request.body.decode())
        user_id = req_data['user_id']

        return_json = []
        routines = Routine.objects.all()
        routines_mine = routines.filter(author_id=user_id)

        for routine in routines_mine:
            routine_dict = {
                'id': routine.id,
                'author': routine.author.id,  # id or name
                'name': routine.name
            }
            return_json.append(routine_dict)
        return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET"])
def routine(request, routine_id):
    """get a routine"""
    if request.method == 'GET':
        try:
            routine = Routine.objects.get(id=routine_id)
            return_json = {
                'id': routine.id,
                'author': routine.author.id,  # id or name
                'name': routine.name,
                'fitelements': list(routine.fit_element.values_list('id', flat=True))
            }
            return JsonResponse(return_json, safe=False, status=201)
        except:
            return HttpResponse(404)


@require_http_methods(["GET"])
def daily_log(request, year, month, date):
    """get daily log per day"""
    if request.method == 'GET':
        req_data = json.loads(request.body.decode())
        user_id = req_data['user_id']

        daily_logs = DailyLog.objects.filter(id=user_id)
        daily_log = daily_logs.filter(date=datetime(year, month, date).date())

        if daily_log is None:
            daily_log_dict = DailyLog(
                date=datetime(year, month, date).date()
            )
            daily_log_dict.save()
        else:
            daily_log_dict = {
                'memo': daily_log.memo,
                'date': daily_log.date,
                'fitelements': list(daily_log.fit_element.values_list('id', flat=True))
            }

        return JsonResponse(daily_log_dict, safe=False, status=200)
