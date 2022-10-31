from unicodedata import category
from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest

from datetime import datetime, date
from .models import FitElement, Routine, DailyLog
import json
from django.views.decorators.http import require_http_methods


@require_http_methods(["POST"])
def create_fit_element(request):
    """
    POST: create fit element
    """
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
        except (KeyError, json.JSONDecodeError):
            return HttpResponseBadRequest()


@require_http_methods(["GET", "PUT", "DELETE"])
def fit_element(request, fit_element_id):
    """
    GET: get a fit element
    PUT: edit a fit element
    DELETE: delete a fit element
    """
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
        except (KeyError, json.JSONDecodeError, FitElement.DoesNotExist):
            return HttpResponse(404)
    elif request.method == 'PUT':
        pass
    elif request.method == 'DELETE':
        pass


@require_http_methods(["GET"])
def get_calendar_info(request, year, month):
    """
    GET: get fit elements for month calendar
    """
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
            cal_dict = {
                "year": year,
                "month": month,
                "date": i,
                "workouts": []
            }
            return_json.append(cal_dict)
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


@require_http_methods(["GET", "POST"])
def routines(request):
    """
    GET: get routines
    POST: create a routine
    """
    if request.method == 'GET':
        req_data = json.loads(request.body.decode())
        user_id = req_data['user_id']

        return_json = []
        routines_all = Routine.objects.all()
        routines_mine = routines_all.filter(author_id=user_id)

        for routine_single in routines_mine:
            routine_dict = {
                'id': routine_single.id,
                'author': routine_single.author.id,  # id or name
                'name': routine_single.name
            }
            return_json.append(routine_dict)
        return JsonResponse(return_json, safe=False, status=200)
    elif request.method == 'POST':
        pass


@require_http_methods(["GET", "PUT", "DELETE"])
def routine(request, routine_id):
    """
    GET: get a routine
    PUT: edit a routine / fit elements changed
    DELETE: delete a routine
    """
    if request.method == 'GET':
        try:
            routine_single = Routine.objects.get(id=routine_id)
            return_json = {
                'id': routine_single.id,
                'author': routine_single.author.id,  # id or name
                'name': routine_single.name,
                'fitelements': list(routine_single.fit_element.values_list('id', flat=True))
            }
            return JsonResponse(return_json, safe=False, status=201)
        except (KeyError, json.JSONDecodeError, Routine.DoesNotExist):
            return HttpResponse(404)
    elif request.method == 'PUT':
        pass
    elif request.method == 'DELETE':
        pass


@require_http_methods(["GET", "POST", "PUT"])
def daily_log(request, year, month, specific_date):
    """
    GET: get a daily log
    POST:  post a memo or add first fit element
    PUT: edit memo or fit elements changed
    """
    if request.method == 'GET':
        req_data = json.loads(request.body.decode())
        user_id = req_data['user_id']

        daily_logs = DailyLog.objects.filter(id=user_id)
        daily_log_single = daily_logs.filter(date=datetime(year, month, specific_date).date())[0]
        # 하나밖에 없도록 처리할 것

        if daily_log_single is None:
            daily_log_dict = DailyLog(
                date=datetime(year, month, specific_date).date()
            )
            daily_log_dict.save()
        else:
            daily_log_dict = {
                'memo': daily_log_single.memo,
                'date': daily_log_single.date,
                'fitelements': list(daily_log.fit_element.values_list('id', flat=True))
            }

        return JsonResponse(daily_log_dict, safe=False, status=200)

    elif request.method == 'POST':
        pass

    elif request.method == 'PUT':
        pass
