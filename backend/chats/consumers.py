import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import User
from chatrooms.models import Chatroom, Message
from notifications.models import Notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        username = self.scope["url_route"]["kwargs"]["username"]
        self.username = username
        await self.channel_layer.group_add("main", self.channel_name)
        await self.accept()
        print(self.username + "님이 채팅 서버에 접속했습니다.")

    async def disconnect(self, _):
        await self.channel_layer.group_discard("main", self.channel_name)
        print(self.username + "님이 채팅 서버에서 나갔습니다.")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data_type = text_data_json["type"]
        data = text_data_json["data"]

        if data_type == "1:1":
            if not (
                (User.objects.filter(username=data["author"])).exists() and
                (Chatroom.objects.filter(id=data["room"])).exists()
            ):
                return

            author = User.objects.get(username=data["author"])
            chatroom = Chatroom.objects.get(id=data["room"])
            target = [chatroom.username1, chatroom.username2]

            message = Message.objects.create(
                room=chatroom,
                author=author,
                content=data["content"]
            )
            chatroom.updated = datetime.datetime.now()
            chatroom.save()

            await self.channel_layer.group_send(
                "main",
                {
                    "type": "send_chat",
                    "target": target,
                    "room": chatroom.id,
                    "data": {
                        "id": message.id,
                        "author": {
                            "username": message.author.username,
                            "nickname": message.author.nickname,
                            "image": message.author.image
                        },
                        "content": message.content,
                        "created": str(message.created)
                    }
                }
            )

        elif data_type == "group":
            pass

        elif data_type == "notification":
            for target_username in data["target"]:
                if User.objects.filter(username=target_username).exists():
                    Notification.objects.create(
                        user=User.objects.get(username=target_username),
                        category=data["category"],
                        content=data["content"],
                        image=data["image"],
                        link=data["link"]
                    )
            await self.channel_layer.group_send(
                "main",
                {
                    "type": "send_notification",
                    "target": data["target"]
                }
            )

    async def send_chat(self, event):
        if self.username in event["target"]:
            print(self.username + "에게 메시지 전달")
            await self.send(text_data=json.dumps({
                "type": "CHAT",
                "where": event["room"],
                "data": event["data"]
            }))

    async def send_notification(self, event):
        if self.username in event["target"]:
            print(self.username + "에게 알림 전달")
            await self.send(text_data=json.dumps({
                "type": "NOTIFICATION",
            }))