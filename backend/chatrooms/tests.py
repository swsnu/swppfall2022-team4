import bcrypt
import datetime
from django.test import TestCase, Client
from users.models import User
from .models import Chatroom, Message


class ImageTestCase(TestCase):

    def setUp(self):
        user1 = User.objects.create(
            username='username1',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            nickname='nickname1',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1
        )
        User.objects.create(
            username='username2',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            nickname='nickname2',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1
        )
        User.objects.create(
            username='username3',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            nickname='nickname3',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1
        )

        chatroom1 = Chatroom.objects.create(
            username1='username1',
            username2='username2'
        )
        chatroom2 = Chatroom.objects.create(
            username1='username1',
            username2='username?'
        )
        Chatroom.objects.create(
            username1='username2',
            username2='username3'
        )

        Message.objects.create(
            room=chatroom1,
            author=user1,
            content="content1"
        )
        Message.objects.create(
            room=chatroom2,
            author=None,
            content="content2"
        )

    def ready(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value
        client.post(
            '/api/user/login/',
            {
                'username': 'username1',
                'password': 'password'
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        return client, csrftoken

    def test_chatroom(self):
        client, csrftoken = self.ready()

        res = client.get('/api/chat/')
        self.assertEqual(res.status_code, 200)

        res = client.post(
            '/api/chat/',
            {"username": "username2"},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 200)

        res = client.post(
            '/api/chat/',
            {"username": "username3"},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 200)

    def test_message(self):
        client, _ = self.ready()

        res = client.get('/api/chat/999/')
        self.assertEqual(res.status_code, 404)

        res = client.get('/api/chat/3/')
        self.assertEqual(res.status_code, 403)

        res = client.get('/api/chat/2/')
        self.assertEqual(res.status_code, 200)
        self.assertIn("content2", res.content.decode())

        res = client.get('/api/chat/1/')
        self.assertEqual(res.status_code, 200)
        self.assertIn("content1", res.content.decode())
