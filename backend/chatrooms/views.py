import json
from django.db.models import Q
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from django.core import serializers
from users.models import User
from .models import Chatroom, Message

@require_http_methods(["GET", "POST"])
def chatroom(request):
    """
    GET : 채팅방 목록 불러오기
    POST : 채팅방 개설
    """
    if request.method == "GET":
        username = request.user.username
        chatrooms = Chatroom.objects.filter(Q(username1=username) | Q(username2=username)).order_by('-updated')
        data = json.loads(serializers.serialize('json', chatrooms))
        response = []

        for chatroom_data in data:
            username1 = chatroom_data['fields']['username1']
            username2 = chatroom_data['fields']['username2']
            target_username = username1 if username2 == username else username2

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

    else:   # POST
        data = json.loads(request.body.decode())
        user = User.objects.get(username=request.user.username)
        target_username = data["username"]

        chatrooms = Chatroom.objects.filter(
            Q(username1=request.user.username, username2=target_username) |
            Q(username2=request.user.username, username1=target_username)
        )
        if len(chatrooms) == 1:
            target_room = Chatroom.objects.get(
                Q(username1=request.user.username, username2=target_username) |
                Q(username2=request.user.username, username1=target_username)
            )
            return JsonResponse({"id": target_room.id}, status=200)
        else:
            target_room = Chatroom.objects.create(
                username1=request.user.username,
                username2=target_username
            )
            Message.objects.create(
                room=target_room,
                group=None,
                author=user,
                content=f"{request.user.nickname}님이 채팅방을 개설했습니다."
            )
            return JsonResponse({"id": target_room.id}, status=200)

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
        