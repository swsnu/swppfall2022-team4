import json
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from json.decoder import JSONDecodeError
from .models import Group
from users.models import User
from workouts.models import FitElement


@require_http_methods(['GET', 'POST'])
def general_group(request):
    """
    GET : get group list
    POST : create group
    """
    if request.method == 'GET':
        group_list = list(
            Group.objects.all().values(
                'id', 'group_name', 'number', 'start_date', 'end_date', 'member_number'
            )
        )
        return JsonResponse({"groups": group_list}, safe=False)

    else:  ## post
        try:
            req_data = json.loads(request.body.decode())
            goal_list = req_data["goal"]
            group = Group(
                group_name=req_data["group_name"],
                number=req_data["number"],
                start_date=req_data["start_date"],
                end_date=req_data["end_date"],
                description=req_data["description"],
                free=req_data["free"],
                group_leader=request.user,
            )
            group.save()
            group.members.add(request.user)
            group.member_number += 1
            group.save()
        except (KeyError, JSONDecodeError):
            return HttpResponseBadRequest()

        for goal in goal_list:
            try:
                fit_element = FitElement(
                    author=request.user,
                    type=goal["type"],
                    workout_type=goal["workout_type"],
                    category=goal["category"],
                    weight=goal["weight"],
                    rep=goal["rep"],
                    set=goal["set"],
                    time=goal["time"],
                )
                fit_element.save()
                group.goal.add(fit_element)
                group.save()
            except (KeyError, json.JSONDecodeError):
                return HttpResponseBadRequest()

        return JsonResponse({"id": group.id}, status=201)


@require_http_methods(["GET", "PUT", "DELETE"])
def group_detail(request, group_id):
    """
    GET : get group detail
    PUT : edit group
    DELETE : delete group
    """
    if request.method == "GET":
        try:
            gr_obj = Group.objects.get(id=int(group_id))
            group_leader = User.objects.get(username=gr_obj.group_leader.username)
            response_dict = {
                "group_id": gr_obj.id,
                "group_name": gr_obj.group_name,
                "number": gr_obj.number,
                "start_date": gr_obj.start_date,
                "end_date": gr_obj.end_date,
                "description": gr_obj.description,
                "free": gr_obj.free,
                "group_leader": {
                    "username": group_leader.username,
                    "nickname": group_leader.nickname,
                    "image": group_leader.image,
                },
                "goal": list(gr_obj.goal.values()),
                "member_number": gr_obj.member_number,
            }
            return JsonResponse(response_dict, status=200)
        except Group.DoesNotExist:
            return JsonResponse({"message": "존재하지 않는 그룹입니다."}, status=404)
        except Exception:
            return HttpResponseBadRequest()

    elif request.method == "PUT":
        ## 그룹 정보 수정
        return HttpResponseBadRequest()

    else:  ## delete
        try:
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id=gr_id)
            if gr_obj.group_leader.username != request.user.username:
                return HttpResponse(status=403)
            gr_obj.delete()
            return HttpResponse(status=204)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()


@require_http_methods(["GET", "POST", "DELETE"])
def group_members(request, group_id):
    """
    GET : get group members
    POST : join group
    DELETE : exit group
    """
    user = request.user
    if request.method == "GET":
        try:
            gr_obj = Group.objects.get(id=int(group_id))
            if not gr_obj.members.filter(username=request.user.username):
                return HttpResponse(status=403)
            member_list = list(gr_obj.members.values('id', 'username', 'image', 'level'))
            return JsonResponse({"members": member_list}, safe=False)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()

    elif request.method == "POST":
        try:
            gr_obj = Group.objects.get(id=int(group_id))
            if gr_obj.members.filter(username=request.user.username):
                return HttpResponseBadRequest()
            gr_obj.members.add(user)
            gr_obj.member_number += 1
            gr_obj.save()
            return HttpResponse(status=204)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()

    else:  ## DELETE
        try:
            gr_obj = Group.objects.get(id=int(group_id))
            if not gr_obj.members.filter(username=request.user.username):
                return HttpResponseBadRequest()
            gr_obj.members.remove(user)
            gr_obj.member_number -= 1
            gr_obj.save()
            return HttpResponse(status=204)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()


@require_http_methods(["GET"])
def group_member_check(request, group_id):
    """
    GET : get member's status
    """
    try:
        gr_obj = Group.objects.get(id=int(group_id))
        if gr_obj.group_leader.username == request.user.username:
            response_dict = {"member_status": "group_leader"}
        elif gr_obj.members.filter(username=request.user.username):
            response_dict = {"member_status": "group_member"}
        else:
            response_dict = {"member_status": "not_member"}
        return JsonResponse(response_dict, safe=False)
    except Group.DoesNotExist:
        return HttpResponseNotFound()
    except Exception:
        return HttpResponseBadRequest()
