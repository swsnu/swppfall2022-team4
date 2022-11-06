from django.shortcuts import render
import json
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseNotFound, JsonResponse
from django.views.decorators.http import require_http_methods
from json.decoder import JSONDecodeError
from users import models as user_model
from .models import Group
from workouts.models import FitElement

@require_http_methods(['GET', 'POST'])
def general_group(request):
    """
    GET : get group list
    POST : create group
    """
    if request.method  == 'GET':
        group_list = [group for group in Group.objects.all().values(
            "id", "group_name", "number", "start_date", "end_date", "member_number", "member_number"
        )]
        return JsonResponse(group_list, safe=False)
    else: ## post
        try:
            req_data = json.loads(request.body.decode())
            group = Group(
                group_name = req_data["group_name"],
                number = req_data["number"],
                start_date = req_data["start_date"],
                end_date = req_data["end_date"],
                description = req_data["description"],
                free = req_data["free"],
                group_leader = user_model.User.objects.get(username=req_data['group_leader']),
            )
            group.save()
            group.members.add(user_model.User.objects.get(username=req_data['group_leader']))
            group.member_number += 1
            group.save()
        except (KeyError, JSONDecodeError):
            return HttpResponse(status = 400)
        goal_list = req_data["goal"]
        for i in range(len(goal_list)):
            try:
                new_fit_element = FitElement(
                    author_id = user_model.User.objects.get(username=req_data['group_leader']).id,
                    type=goal_list[i]["type"],
                    workout_type=goal_list[i]["workout_type"],
                    category=goal_list[i]["category"],
                    weight=goal_list[i]["weight"],
                    rep=goal_list[i]["rep"],
                    set=goal_list[i]["set"],
                    time=goal_list[i]["time"],
                )
                new_fit_element.save()
                group.goal.add(new_fit_element)
                group.save()
            except (KeyError, json.JSONDecodeError):
                return HttpResponseBadRequest()
        response_dict = {
            "id" : group.id,
            "group_name" : group.group_name,
            "number" : group.number,
            "start_date" : group.start_date,
            "end_date" : group.end_date,
            "description" : group.description,
            "member_number" : group.member_number,
            "free" : group.free,
            "group_leader": {
                "username": group.group_leader.username,
                "nickname": group.group_leader.nickname
            },
            "goal": [goal for goal in group.goal.values()]
        }
        return JsonResponse(response_dict, status = 201)

@require_http_methods(["GET", "PUT", "DELETE"])
def group_detail(request, group_id):
    """
    GET : get group detail
    PUT : edit group
    DELETE : delete group
    """
    if request.method == "GET":
        try:
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id = gr_id)
            response_dict = {
                "group_name" : gr_obj.group_name,
                "number" : gr_obj.number,
                "start_date" : gr_obj.start_date,
                "end_date" : gr_obj.end_date,
                "description" : gr_obj.description,
                "free" : gr_obj.free,
                "member_number":gr_obj.member_number,
                "group_leader": {
                    "username": gr_obj.group_leader.username,
                    "nickname": gr_obj.group_leader.nickname
                },
                "goal": [goal for goal in gr_obj.goal.values()]
            }
            return JsonResponse(response_dict, status = 200)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()
    elif request.method == "PUT":
        ## todo
        return HttpResponseBadRequest()
    else: ## delete
        try:
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id = gr_id)
            gr_obj.delete()
            return JsonResponse({"message":"success"}, status = 200)
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
    if request.method == "GET":
        try:
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id = gr_id)
            response_dict = [member for member in gr_obj.members.values(
                "id", "username", "image", "level"
            )]
            return JsonResponse(response_dict, safe=False)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()
    else: ## POST
        try:
            req_data = json.loads(request.body.decode())
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id = gr_id)
            member = user_model.User.objects.get(username=req_data['member'])
            gr_obj.members.add(member)
            gr_obj.member_number += 1
            gr_obj.save()
            return JsonResponse({"member_status":"group_member"}, status = 201)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()

@require_http_methods(["GET", "DELETE"])
def group_member(request, group_id, member):
    if request.method == "GET":
        ## todo
        return HttpResponseBadRequest()
    else:
        try:
            gr_id = int(group_id)
            gr_obj = Group.objects.get(id = gr_id)
            member_obj = user_model.User.objects.get(username=member)
            gr_obj.members.remove(member_obj)
            gr_obj.member_number -= 1
            gr_obj.save()
            return JsonResponse({"member_status":"not_member"}, status = 200)
        except Group.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()

@require_http_methods(["PUT"])
def group_member_check(request, group_id):
    """
    PUT : get member's status
    """
    try:
        gr_id = int(group_id)
        gr_obj = Group.objects.get(id = gr_id)
        req_data = json.loads(request.body.decode())
        username=req_data['member']
        if gr_obj.group_leader.username == username:
            response_dict = {"member_status": "group_leader"}
        elif gr_obj.members.filter(username = username):
            response_dict = {"member_status": "group_member"}
        else:
            response_dict = {"member_status": "not_member"}
        return JsonResponse(response_dict, safe=False)
    except Group.DoesNotExist:
        return HttpResponseNotFound()
    except Exception:
        return HttpResponseBadRequest()