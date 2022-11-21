from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse, HttpResponseBadRequest

from datetime import datetime, date
from .models import FitElement, Routine, DailyLog, FitElementType
import json
from django.views.decorators.http import require_http_methods
import calendar


@require_http_methods(["POST"])
def create_fit_element(request):
    """
    POST: create a fit element
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
                date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d'),
            )
            new_fit_element.save()

            daily_logs = DailyLog.objects.filter(
                author_id=int(req_data["user_id"]))

            if not daily_logs.filter(
                date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d')
            ).exists():
                new_daily_log = DailyLog(
                    author_id=req_data["user_id"],
                    memo="",
                    date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d'),
                )
                new_daily_log.save()
                new_daily_log.fit_element.add(new_fit_element)
                new_daily_log.calories = 0
                fitelement_type = FitElementType.objects.get(korean_name=new_fit_element.workout_type)
                new_daily_log.calories += fitelement_type.calories/68*60/60*new_fit_element.time
                new_daily_log.save()

            else:
                daily_log_single = daily_logs.filter(
                    date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d')
                )[0]
                daily_log_single.fit_element.add(new_fit_element)
                fitelement_type = FitElementType.objects.get(korean_name=new_fit_element.workout_type)
                daily_log_single.calories += fitelement_type.calories/68*60/60*new_fit_element.time
                daily_log_single.save()

            return JsonResponse({"workout_id": str(new_fit_element.pk)}, status=201)
        except (KeyError, json.JSONDecodeError):
            return HttpResponseBadRequest()


@require_http_methods(["GET", "PUT", "DELETE"])
def fit_element(request, fitelement_id):
    """
    GET: get a fit element
    PUT: edit a fit element
    DELETE: delete a fit element
    """
    if request.method == 'GET':
        if FitElement.objects.filter(id=fitelement_id).exists():
            workout = FitElement.objects.get(id=fitelement_id)
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
                'date': workout.date,
            }
            return JsonResponse(return_json, safe=False, status=201)
        else:
            return HttpResponseBadRequest(status=404)


@require_http_methods(["GET"])
def get_calendar_info(request, year, month):
    """
    GET: get fit elements for month calendar
    """
    if request.method == 'GET':
        user_id = request.GET.get('user_id')

        return_json = []
        this_month = datetime(year, month, 1).date()
        if month == 12:
            next_month = datetime(year + 1, 1, 1).date()
        else:
            next_month = datetime(year, month + 1, 1).date()
        for i in range(1, 32):
            cal_dict = {"year": year, "month": month,
                        "date": i, "workouts": [], "calories": 0}
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
                'date': workout.date,
            }
            return_json[int(workout_dict['date'].day) -
                        1]['workouts'].append(workout_dict)

        daily_logs = DailyLog.objects.filter(author_id=int(user_id))
        
        for i in range(1, calendar.monthrange(year, month)[1]):
            daily_log_single = daily_logs.filter(date=datetime(year, month, i).date())
            if len(daily_log_single) == 0:
                return_json[i-1]['calories'] = 0
            else:
                return_json[i-1]['calories'] = daily_log_single[0].calories

        return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET", "POST"])
def routines(request):
    """
    GET: get routines
    POST: create a routine
    """
    if request.method == 'GET':
        user_id = request.GET.get('user_id')

        return_json = []
        routines_all = Routine.objects.all()
        routines_mine = routines_all.filter(author_id=user_id)

        for routine_single in routines_mine:
            routine_dict = {
                'id': routine_single.id,
                'author': routine_single.author.id,  # id or name
                'name': routine_single.name,
                'fitelements': list(routine_single.fit_element.values_list('id', flat=True)),
            }
            return_json.append(routine_dict)
        return JsonResponse(return_json, safe=False, status=200)
    elif request.method == 'POST':
        user_id = request.GET.get('user_id')
        req_data = json.loads(request.body.decode())
        fitelements = req_data["fitelements"]
        new_routine = Routine(author_id=req_data["user_id"], name="temp")

        new_routine.save()
        new_routine.name = "routine" + str(new_routine.pk)
        for fitelement_id in fitelements:
            if FitElement.objects.filter(id=fitelement_id).exists():
                fitelement = FitElement.objects.get(id=fitelement_id)
                fitelement.pk = None
                fitelement.save()
                new_routine.fit_element.add(fitelement)
        new_routine.save()
        return HttpResponse(status=201)


@require_http_methods(["GET", "PUT", "DELETE"])
def routine(request, routine_id):
    """
    GET: get a routine
    PUT: edit a routine / fit elements changed
    DELETE: delete a routine
    """
    if request.method == 'GET':
        if Routine.objects.filter(id=routine_id).exists():
            routine_single = Routine.objects.get(id=routine_id)
            return_json = {
                'id': routine_single.id,
                'author': routine_single.author.id,  # id or name
                'name': routine_single.name,
                'fitelements': list(routine_single.fit_element.values_list('id', flat=True)),
            }
            return JsonResponse(return_json, safe=False, status=201)
        else:
            return HttpResponseBadRequest()


@require_http_methods(["GET", "POST", "PUT"])
def daily_log(request, year, month, specific_date):
    """
    GET: get a daily log
    POST:  post a memo or add first fit element
    PUT: edit memo or fit elements changed
    """
    if request.method == 'GET':
        user_id = request.GET.get('user_id')

        daily_logs = DailyLog.objects.filter(author_id=int(user_id))
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())

        if len(daily_log_single) == 0:
            daily_log_dict_return = {
                'author': -1,
                'memo': "",
                'date': datetime(year, month, specific_date).date(),
                'calories': 0,
                'fitelements': [],
            }
            return JsonResponse(daily_log_dict_return, safe=False, status=200)

        daily_log_dict_return = {
            'author': daily_log_single[0].author.id,
            'memo': daily_log_single[0].memo,
            'date': daily_log_single[0].date,
            'calories': daily_log_single[0].calories,
            'fitelements': list(daily_log_single[0].fit_element.values_list('id', flat=True)),
        }

        return JsonResponse(daily_log_dict_return, safe=False, status=200)

    elif request.method == 'POST':
        user_id = request.GET.get('user_id')
        daily_logs = DailyLog.objects.filter(author_id=int(user_id))
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())

        if len(daily_log_single) == 0:
            req_data = json.loads(request.body.decode())
            new_daily_log = DailyLog(
                author_id=req_data["user_id"],
                memo=req_data["memo"],
                date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d'),
                calories=0
            )
            new_daily_log.save()
            return JsonResponse({"dailylog_date": new_daily_log.date}, status=201)

    elif request.method == 'PUT':
        user_id = request.GET.get('user_id')
        daily_logs = DailyLog.objects.filter(author_id=int(user_id))
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())

        req_data = json.loads(request.body.decode())
        return_json = []
        if "memo" in req_data:
            if len(daily_log_single) == 0:
                new_daily_log = DailyLog(
                    author_id=req_data["user_id"],
                    memo=req_data["memo"],
                    date=str(year) + '-' + str(month) +
                    '-' + str(specific_date),
                    calories=0
                )
                new_daily_log.save()
                return HttpResponse(status=201)
            memo = req_data["memo"]
            daily_log_single[0].memo = memo
            daily_log_single[0].save()
            return HttpResponse(status=201)
        fitelements = req_data["fitelements"]
        if len(daily_log_single) == 0:
            new_daily_log = DailyLog(
                author_id=req_data["user_id"],
                memo="",
                date=str(year) + '-' + str(month) + '-' + str(specific_date),
                calories=0
            )
            new_daily_log.save()
            for fitelement_id in fitelements:
                if FitElement.objects.filter(id=fitelement_id).exists():
                    fitelement = FitElement.objects.get(id=fitelement_id)
                    fitelement.pk = None
                    fitelement.date = str(year) + '-' + \
                        str(month) + '-' + str(specific_date)
                    fitelement.save()
                    return_json.append(fitelement.pk)
                    new_daily_log.fit_element.add(fitelement)
                    fitelement_type = FitElementType.objects.get(korean_name=fitelement.workout_type)
                    new_daily_log.calories += fitelement_type.calories/68*60/60*fitelement.time
            new_daily_log.save()
            return JsonResponse(return_json, safe=False, status=200)

        for fitelement_id in fitelements:
            if FitElement.objects.filter(id=fitelement_id).exists():
                fitelement = FitElement.objects.get(id=fitelement_id)
                fitelement.pk = None
                fitelement.date = str(year) + '-' + \
                    str(month) + '-' + str(specific_date)
                fitelement.save()
                return_json.append(fitelement.pk)
                daily_log_single[0].fit_element.add(fitelement)
                fitelement_type = FitElementType.objects.get(korean_name=fitelement.workout_type)
                daily_log_single[0].calories += fitelement_type.calories/68*60/60*fitelement.time
        daily_log_single[0].save()
        return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET"])
def get_fitelement_types(request):
    types = FitElementType.objects.all()
    return_json = []
    for fitelement_type in types:
        type_json = {
            'name': fitelement_type.name,
            'korean_name': fitelement_type.korean_name,
            'calories': fitelement_type.calories,
            'category': fitelement_type.category
        }
        return_json.append(type_json)
    return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET"])
def get_fitelement_type(request, name):
    pass