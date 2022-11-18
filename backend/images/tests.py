import os
import json
import bcrypt
import datetime
from django.test import TestCase, Client
from users.models import User

class ImageTestCase(TestCase):

    def setUp(self):
        User.objects.create(
            username='username',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
            nickname='nickname',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1,
            created=datetime.date.today()
        )

    def test_upload(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value
        client.post(
            '/api/user/login/',
            {'username': 'username', 'password': 'password'},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )

        with open('images/test/test.txt', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        with open('images/test/test.bmp', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 400)

        with open('images/test/test.jpg', 'rb') as test_image:
            response = client.put('/api/image/', {'image': test_image}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 405)

        response = client.post('/api/image/', {'image': 'error'}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 500)

        with open('images/test/test.jpg', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image}, HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(response.status_code, 200)
        os.remove(os.path.join("media", json.loads(response.content.decode())["title"]))
