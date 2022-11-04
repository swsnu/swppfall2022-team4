import json
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.core import serializers
from users.models import User
from .models import Chatroom, Message

@require_http_methods(["GET"])
def chatroom(request, user_id):
    """
    GET : 채팅방 목록 불러오기
    """
    if request.user.username != user_id:
        return HttpResponse(status=403)

    chatrooms = Chatroom.objects.filter(Q(username1=user_id) | Q(username2=user_id)).order_by('-updated')
    data = json.loads(serializers.serialize('json', chatrooms))
    response = []

    for chatroom_data in data:
        username1 = chatroom_data['fields']['username1']
        username2 = chatroom_data['fields']['username2']
        target_username = username1 if username2 == user_id else username2

        if not (User.objects.filter(username=target_username)).exists():
            user = None
        else:
            target = User.objects.get(username=target_username)
            user = {
                "username": target.username,
                "nickname": target.nickname,
                "image": target.image
            }

        response.append({
            "id": chatroom_data['pk'],
            "user": user,
        })

    return JsonResponse(response, safe=False)

@require_http_methods(["GET"])
def message(request, room_id):
    """
    GET : 메시지 목록 불러오기
    """
    if not (Chatroom.objects.filter(id=room_id)).exists():
        return HttpResponse(status=404)

    room = Chatroom.objects.get(id=room_id)
    if request.user.username not in [room.username1, room.username2]:
        return HttpResponse(status=403)

    if request.method == 'GET':
        messages = Message.objects.filter(room=room_id).order_by('created')
        data = json.loads(serializers.serialize('json', messages))
        response = []

        for message_data in data:
            author = message_data['fields']['author']
            content = message_data['fields']['content']

            if not (User.objects.filter(id=author)).exists():
                author = None
            else:
                author = User.objects.get(id=author)
                author = {
                    "username": author.username,
                    "nickname": author.nickname,
                    "image": author.image,
                }

            response.append({
                "id": message_data['pk'],
                "author": author,
                "content": content,
                "created": message_data['fields']['created']
            })

        return JsonResponse(response, safe=False)
        