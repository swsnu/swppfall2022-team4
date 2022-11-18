import bcrypt
import datetime
from django.test import TestCase, Client
from users.models import User
from notifications.models import Notification


class NotificationTestCase(TestCase):

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

        Notification.objects.create(
            user=user1,
            category="comment",
            content="content",
            image="image",
            link="link"
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

    def test_index(self):
        client, csrftoken = self.ready()

        res = client.get('/api/notification/')
        self.assertEqual(res.status_code, 200)

        res = client.delete(
            '/api/notification/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 204)

    def test_delete_notification(self):
        client, csrftoken = self.ready()

        res = client.delete(
            '/api/notification/1/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 204)
