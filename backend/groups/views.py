import json
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from json.decoder import JSONDecodeError
from groups.models import Group, GroupCert
from users.models import User
from tags.models import Tag
from workouts.models import FitElement
from datetime import datetime


@require_http_methods(['GET', 'POST'])
def general_group(request):
    """
    GET : get group list
    POST : create group
    """
    if request.method == 'GET':
        group_list = list(
            Group.objects.all().values(
                'id',
                'group_name',
                'number',
                'start_date',
                'end_date',
                'member_number',
                'lat',
                'lng',
                'address',
            )
        )
        return JsonResponse({"groups": group_list}, safe=False)

    else:  ## post
        try:
            req_data = json.loads(request.body.decode())
            group = Group(
                group_name=req_data["group_name"],
                number=req_data["number"],
                start_date=req_data["start_date"],
                end_date=req_data["end_date"],
                description=req_data["description"],
                free=req_data["free"],
                lat=req_data["lat"],
                lng=req_data["lng"],
                address=req_data["address"],
                group_leader=request.user,
            )
            goal_list = req_data["goal"]
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
                    workout_type=Tag.objects.get(tag_name=goal["workout_type"]),
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

            goals = gr_obj.goal.values()
            return_goal = []
            for goal in goals:
                workout_tag = Tag.objects.get(pk=goal['workout_type_id'])
                return_goal.append(
                    {
                        "id": goal['workout_type_id'],
                        "type": goal['type'],
                        "weight": goal['weight'],
                        "rep": goal['rep'],
                        "set": goal['set'],
                        "time": goal['time'],
                        "workout_type": workout_tag.tag_name,
                        "category": workout_tag.tag_class.class_name,
                    }
                )
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
                "lat": gr_obj.lat,
                "lng": gr_obj.lng,
                "address": gr_obj.address,
                "goal": return_goal,
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
            result = []
            for i in gr_obj.members.all():
                cert_days = len(GroupCert.objects.filter(member=i.id))
                result.append(
                    {
                        "id": i.id,
                        "username": i.username,
                        "image": i.image,
                        "level": i.level,
                        "cert_days": cert_days,
                    }
                )
            return JsonResponse({"members": result}, safe=False)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()

    elif request.method == "POST":
        try:
            gr_obj = Group.objects.get(id=int(group_id))
            if gr_obj.members.filter(username=request.user.username):
                return HttpResponseBadRequest()
            if gr_obj.member_number == gr_obj.number:
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


@require_http_methods(["POST"])
def group_leader_change(request, group_id):
    """
    POST : change group leader
    """
    try:
        gr_obj = Group.objects.get(id=int(group_id))
        if gr_obj.group_leader.username != request.user.username:
            HttpResponseBadRequest()
    except Group.DoesNotExist:
        return HttpResponseNotFound()
    except Exception:
        return HttpResponseBadRequest()
    try:
        req_data = json.loads(request.body.decode())
        member_name = req_data["username"]
        if not gr_obj.members.filter(username=member_name):
            return HttpResponseBadRequest()
        new_leader = User.objects.get(username=member_name)
        gr_obj.group_leader = new_leader
        gr_obj.save()
        return HttpResponse(status=204)
    except (KeyError, JSONDecodeError):
        return HttpResponseBadRequest()
    except Exception:
        return HttpResponseBadRequest()


@require_http_methods(["GET", "POST", "DELETE"])
def group_cert(request, group_id, year, month, specific_date):
    """
    GET : Get specific day's group certs
    POST : Create specific day's group cert
    DELETE : Delete specific day's group cert(a fitelement)
    """
    if request.method == "GET":
        certs = GroupCert.objects.filter(group=group_id).filter(
            date=datetime(year, month, specific_date).date()
        )
        if len(certs) == 0:
            return JsonResponse({"all_certs": []}, status=200)
        else:
            result = []
            for single_cert in certs:
                result.append(
                    {
                        "member": {
                            "username": single_cert.member.username,
                            "nickname": single_cert.member.nickname,
                            "image": single_cert.member.image,
                        },
                        "certs": list(single_cert.fit_element.values()),
                    }
                )
            response_dict = {"all_certs": result}
        return JsonResponse(response_dict, status=200)
    elif request.method == "POST":
        req_data = json.loads(request.body.decode())
        gr_obj = Group.objects.get(id=int(group_id))
        fit = gr_obj.goal.get(id=req_data["fitelement_id"])

        cert = (
            GroupCert.objects.filter(member=request.user.id)
            .filter(date=datetime(year, month, specific_date).date())
            .filter(group=group_id)
        )

        if len(cert) != 0:
            updated_cert = (
                GroupCert.objects.filter(member=request.user.id)
                .filter(date=datetime(year, month, specific_date).date())
                .get(group=group_id)
            )
            updated_cert.fit_element.add(fit)
            updated_cert.save()
        else:
            new_cert = GroupCert(
                group=gr_obj, member=request.user, date=datetime(year, month, specific_date).date()
            )
            new_cert.save()
            new_cert.fit_element.add(fit)
            new_cert.save()
        certs = GroupCert.objects.filter(group=group_id).filter(
            date=datetime(year, month, specific_date).date()
        )
        result = []
        for single_cert in certs:
            result.append(
                {
                    "member": {
                        "username": single_cert.member.username,
                        "nickname": single_cert.member.nickname,
                        "image": single_cert.member.image,
                    },
                    "certs": list(single_cert.fit_element.values()),
                }
            )
        response_dict = {"all_certs": result}
        return JsonResponse(response_dict, status=200)
