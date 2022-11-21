import json
import datetime
from channels.generic.websocket import AsyncWebsocketConsumer
from users.models import User
from posts.models import Post
from comments.models import Comment
from groups.models import Group
from chatrooms.models import Chatroom, Message
from notifications.models import Notification

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        username = self.scope["url_route"]["kwargs"]["username"]
        self.username = username
        await self.channel_layer.group_add("main", self.channel_name)
        await self.accept()
        print(self.username + "님이 서버에 접속했습니다.")

    async def disconnect(self, _):
        await self.channel_layer.group_discard("main", self.channel_name)
        print(self.username + "님이 서버에서 나갔습니다.")

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        data_type = text_data_json["type"]
        data = text_data_json["data"]

        if data_type == "1:1":
            if not (
                User.objects.filter(username=data["author"]).exists() and
                Chatroom.objects.filter(id=data["room"]).exists()
            ):
                return

            author = User.objects.get(username=data["author"])
            chatroom = Chatroom.objects.get(id=data["room"])

            message = Message.objects.create(
                room=chatroom,
                author=author,
                content=data["content"]
            )

            if chatroom.username1 == data["author"]:
                chatroom.new2 = True
            else:
                chatroom.new1 = True
            chatroom.recent_message = data["content"]
            chatroom.updated = datetime.datetime.now()
            chatroom.save()

            await self.channel_layer.group_send(
                "main",
                {
                    "type": "send_chat",
                    "target": [chatroom.username1, chatroom.username2],
                    "where": chatroom.id,
                    "message": {
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
            if not (
                User.objects.filter(username=data["author"]).exists() and
                Group.objects.filter(id=data["group"]).exists()
            ):
                return

            author = User.objects.get(username=data["author"])
            group = Group.objects.get(id=data["group"])
            group_members = group.members.all().values("username")
            group_username_list = []
            for member in group_members:
                group_username_list.append(member["username"])

            message = Message.objects.create(
                group=group,
                author=author,
                content=data["content"]
            )

            await self.channel_layer.group_send(
                "main",
                {
                    "type": "send_group_chat",
                    "target": group_username_list,
                    "where": group.id,
                    "message": {
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

        elif data_type == "notification":
            """
            [알림 생성]
            data 형식: category, info, content, image, link
            category에 따라 info를 바탕으로 알림을 받을 대상(target)을 탐색
            """
            target = []

            if data["category"] == "comment":
                # info: 작성자의 username, 게시글 id, 부모 댓글 id
                my_username = data["info"]["me"]
                post_id = data["info"]["post"]
                comment_id = data["info"]["comment"]

                if not Post.objects.filter(id=post_id).exists():
                    return

                post = Post.objects.get(id=post_id)
                if post.author.username != my_username:
                    target.append(post.author.username)

                if Comment.objects.filter(id=comment_id).exists():
                    comment = Comment.objects.get(id=comment_id)
                    if comment.author.username not in [my_username, post.author.username]:
                        target.append(comment.author.username)

            elif data["category"] == "postFunc":
                # info: 작성자의 username, 게시글 id
                my_username = data["info"]["me"]
                post_id = data["info"]["post"]

                if not Post.objects.filter(id=post_id).exists():
                    return

                post = Post.objects.get(id=post_id)
                if post.author.username != my_username:
                    target.append(post.author.username)

            elif data["category"] == "commentFunc":
                # info: 작성자의 username, 댓글 id
                my_username = data["info"]["me"]
                comment_id = data["info"]["comment"]

                if not Comment.objects.filter(id=comment_id).exists():
                    return

                comment = Comment.objects.get(id=comment_id)
                if comment.author.username != my_username:
                    target.append(comment.author.username)

            elif data["category"] == "follow":
                # info : 대상 username
                target.append(data["info"])

            else:
                pass

            for target_username in target:
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
                    "target": target
                }
            )

    async def send_chat(self, event):
        if self.username in event["target"]:
            print(self.username + "에게 메시지 전달")
            await self.send(text_data=json.dumps({
                "type": "CHAT",
                "where": str(event["where"]),
                "message": event["message"]
            }))

    async def send_group_chat(self, event):
        if self.username in event["target"]:
            print(self.username + "에게 그룹 메시지 전달")
            await self.send(text_data=json.dumps({
                "type": "GROUP_CHAT",
                "where": str(event["where"]),
                "message": event["message"]
            }))

    async def send_notification(self, event):
        if self.username in event["target"]:
            print(self.username + "에게 알림 전달")
            await self.send(text_data=json.dumps({
                "type": "NOTIFICATION",
            }))
