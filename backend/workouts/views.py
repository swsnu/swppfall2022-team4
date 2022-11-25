from django.http import HttpResponse, JsonResponse, HttpResponseBadRequest
from django.views.decorators.http import require_http_methods
from datetime import datetime
from workouts.models import FitElement, Routine, DailyLog
from tags.models import TagClass, Tag
from tags.views import prepare_tag_response
from users.models import User
import json
import calendar

DATE_FORMAT = '%Y-%m-%d'


@require_http_methods(["POST"])
def create_fit_element(request):
    """
    POST: create a fit element
    """
    if request.method == 'POST':
        try:
            req_data = json.loads(request.body.decode())
            user = User.objects.get(username=req_data["username"])
            tag = Tag.objects.get(tag_name=req_data["workout_type"])
            new_fit_element = FitElement(
                author=user,
                type=req_data["type"],
                workout_type=tag,
                period=req_data["period"],
                weight=req_data["weight"],
                rep=req_data["rep"],
                set=req_data["set"],
                time=req_data["time"],
                date=datetime.strptime(req_data["date"][0:10], DATE_FORMAT),
            )
            new_fit_element.save()

            daily_logs = DailyLog.objects.filter(author=user)

            if not daily_logs.filter(
                date=datetime.strptime(req_data["date"][0:10], DATE_FORMAT)
            ).exists():
                new_daily_log = DailyLog(
                    author=user,
                    memo="",
                    date=datetime.strptime(
                        req_data["date"][0:10], DATE_FORMAT),
                )
                new_daily_log.save()
                new_daily_log.fit_element.add(new_fit_element)
                new_daily_log.calories = 0
                fitelement_type = Tag.objects.get(
                    tag_name=new_fit_element.workout_type)
                new_daily_log.calories += fitelement_type.calories * new_fit_element.time
                new_daily_log.save()

            else:
                daily_log_single = daily_logs.filter(
                    date=datetime.strptime(req_data["date"][0:10], DATE_FORMAT)
                )[0]
                daily_log_single.fit_element.add(new_fit_element)
                fitelement_type = Tag.objects.get(
                    tag_name=new_fit_element.workout_type)
                daily_log_single.calories += fitelement_type.calories * new_fit_element.time
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
                'workout_type': workout.workout_type.tag_name,
                'category': workout.workout_type.tag_class.class_name,
                'period': workout.period,
                'weight': workout.weight,
                'rep': workout.rep,
                'set': workout.set,
                'time': workout.time,
                'date': workout.date,
            }
            return JsonResponse(return_json, safe=False, status=201)
        else:
            return HttpResponseBadRequest(status=404)
    elif request.method == 'DELETE':
        if FitElement.objects.filter(id=fitelement_id).exists():
            workout = FitElement.objects.get(id=fitelement_id)
            username = request.GET.get('username')
            user = User.objects.get(username=username)
            daily_logs = DailyLog.objects.filter(author=user)
            daily_log_single = daily_logs.get(date=workout.date)
            fitelement_type = Tag.objects.get(tag_name=workout.workout_type)
            daily_log_single.calories -= (
                fitelement_type.calories / 68 * 60 / 60 * workout.time
            )
            daily_log_single.save()
            workout.delete()
            return JsonResponse({"id": fitelement_id, "message": "success"}, status=200)
        else:
            return HttpResponseBadRequest(status=404)


@require_http_methods(["GET"])
def get_calendar_info(request, year, month):
    """
    GET: get fit elements for month calendar
    """
    if request.method == 'GET':
        username = request.GET.get('username')
        user = User.objects.get(username=username)

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

        workouts = workouts_all.filter(author=user)

        for workout in workouts:
            workout_dict = {
                'id': workout.id,
                'author': workout.author.id,  # id or name
                'type': workout.type,
                'workout_type': workout.workout_type.tag_name,
                'category': workout.workout_type.tag_class.class_name,
                'period': workout.period,
                'weight': workout.weight,
                'rep': workout.rep,
                'set': workout.set,
                'time': workout.time,
                'date': workout.date,
            }
            return_json[int(workout_dict['date'].day) -
                        1]['workouts'].append(workout_dict)
        daily_logs = DailyLog.objects.filter(author=user)
        for i in range(1, calendar.monthrange(year, month)[1]):
            daily_log_single = daily_logs.filter(
                date=datetime(year, month, i).date())
            if len(daily_log_single) == 0:
                return_json[i - 1]['calories'] = 0
            else:
                return_json[i - 1]['calories'] = daily_log_single[0].calories

        return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET", "POST"])
def routines(request):
    """
    GET: get routines
    POST: create a routine
    """
    if request.method == 'GET':
        username = request.GET.get('username')
        user = User.objects.get(username=username)

        return_json = []
        routines_all = Routine.objects.all()
        routines_mine = routines_all.filter(author=user)

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
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        req_data = json.loads(request.body.decode())
        fitelements = req_data["fitelements"]
        new_routine = Routine(author=user, name="temp")

        new_routine.save()
        new_routine.name = "routine" + str(new_routine.pk)
        for fitelement_id in fitelements:
            if FitElement.objects.filter(id=fitelement_id).exists():
                fitelement = FitElement.objects.get(id=fitelement_id)
                fitelement.date = None
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
    POST: post a memo or add first fit element
    PUT: edit memo or fit elements changed
    """
    if request.method == 'GET':
        username = request.GET.get('username')
        user = User.objects.get(username=username)

        daily_logs = DailyLog.objects.filter(author=user)
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())

        if len(daily_log_single) == 0:
            daily_log_dict_return = {
                'author': -1,
                'memo': "",
                'date': datetime(year, month, specific_date).date(),
                'calories': 0,
                'fitelements': [],
                'image': "",
            }
            return JsonResponse(daily_log_dict_return, safe=False, status=200)

        daily_log_dict_return = {
            'author': daily_log_single[0].author.id,
            'memo': daily_log_single[0].memo,
            'date': daily_log_single[0].date,
            'calories': daily_log_single[0].calories,
            'fitelements': list(daily_log_single[0].fit_element.values_list('id', flat=True)),
            'image': daily_log_single[0].image,
        }

        return JsonResponse(daily_log_dict_return, safe=False, status=200)

    elif request.method == 'POST':
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        daily_logs = DailyLog.objects.filter(author=user)
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())

        if len(daily_log_single) == 0:
            req_data = json.loads(request.body.decode())
            new_daily_log = DailyLog(
                author=user,
                memo=req_data["memo"],
                date=datetime.strptime(req_data["date"][0:10], '%Y-%m-%d'),
                calories=0,
            )
            new_daily_log.save()
            return JsonResponse({"dailylog_date": new_daily_log.date}, status=201)

    elif request.method == 'PUT':
        username = request.GET.get('username')
        user = User.objects.get(username=username)
        daily_logs = DailyLog.objects.filter(author=user)
        daily_log_single = daily_logs.filter(
            date=datetime(year, month, specific_date).date())
        req_data = json.loads(request.body.decode())
        return_json = []
        if "image" in req_data:
            if len(daily_log_single) == 0:
                new_daily_log = DailyLog(
                    author=user,
                    image=req_data["image"],
                    date=str(year) + '-' + str(month) +
                    '-' + str(specific_date),
                    calories=0,
                )
                new_daily_log.save()
                return HttpResponse(status=201)
            image = req_data["image"]
            daily_log_single[0].image = image
            daily_log_single[0].save()
            return HttpResponse(status=201)

        if "memo" in req_data:
            if len(daily_log_single) == 0:
                new_daily_log = DailyLog(
                    author=user,
                    memo=req_data["memo"],
                    date=str(year) + '-' + str(month) +
                    '-' + str(specific_date),
                    calories=0,
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
                author=user,
                memo="",
                date=str(year) + '-' + str(month) + '-' + str(specific_date),
                calories=0,
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
                    fitelement_type = Tag.objects.get(
                        tag_name=fitelement.workout_type)
                    new_daily_log.calories += (
                        fitelement_type.calories / 68 * 60 / 60 * fitelement.time
                    )
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
                fitelement_type = Tag.objects.get(
                    tag_name=fitelement.workout_type)
                daily_log_single[0].calories += (
                    fitelement_type.calories / 68 * 60 / 60 * fitelement.time
                )
        daily_log_single[0].save()
        return JsonResponse(return_json, safe=False, status=200)


@require_http_methods(["GET"])
def get_fitelement_types(request):
    tag_classes = TagClass.objects.filter(class_type='workout')
    tag_classes_serializable = list(tag_classes.values())

    for index, _ in enumerate(tag_classes_serializable):
        tag_visual_list = []
        for tag in tag_classes[index].tags.all():
            tag_visual_list.append(
                prepare_tag_response(
                    [tag.pk, tag.tag_name, tag_classes[index].color],
                    tag.calories,
                    tag_classes[index].class_type,
                )
            )
        tag_classes_serializable[index]["tags"] = tag_visual_list

    return JsonResponse(tag_classes_serializable, safe=False, status=200)
