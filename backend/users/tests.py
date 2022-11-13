import os
import jwt
import bcrypt
import datetime
from django.test import TestCase, Client
from users.models import User


class ImageTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(
            username='username',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode(
                'utf-8'
            ),
            nickname='nickname',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1,
        )
        User.objects.create(
            username='username2',
            hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode(
                'utf-8'
            ),
            nickname='nickname2',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1,
        )
        self.assertEqual(str(user1), 'username')

    def ready(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value
        client.post(
            '/api/user/login/',
            {'username': 'username', 'password': 'password'},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        return client, csrftoken

    def test_middleware(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.put(
            '/api/user/profile/username/',
            {
                'oldPassword': 'password',
                'newPassword': 'newpassword',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 401)

        token = jwt.encode({}, os.environ.get("JWT_SECRET"), os.environ.get("ALGORITHM"))
        client.cookies['access_token'] = token
        res = client.put(
            '/api/user/profile/username/',
            {
                'oldPassword': 'password',
                'newPassword': 'newpassword',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 401)

    def test_signup(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.post(
            '/api/user/signup/', {}, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post(
            '/api/user/signup/',
            {
                'username': 'username',
                'password': 'password',
                'nickname': 'nickname',
                'gender': 'male',
                'age': 23,
                'height': 108.7,
                'weight': 75,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 409)

        res = client.post(
            '/api/user/signup/',
            {
                'username': 'username1',
                'password': 'password',
                'nickname': 'nickname',
                'gender': 'male',
                'age': 23,
                'height': 108.7,
                'weight': 75,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 409)

        res = client.post(
            '/api/user/signup/',
            {
                'username': 'username1',
                'password': 'password',
                'nickname': 'nickname1',
                'gender': 'male',
                'age': 23,
                'height': 108.7,
                'weight': 75,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

    def test_login(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.post(
            '/api/user/login/', {}, content_type='application/json', HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post(
            '/api/user/login/',
            {'username': '', 'password': ''},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.post(
            '/api/user/login/',
            {'username': 'username', 'password': ''},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.post(
            '/api/user/login/',
            {'username': 'username?', 'password': 'password'},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 401)

        res = client.post(
            '/api/user/login/',
            {'username': 'username', 'password': 'password?'},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 401)

        res = client.post(
            '/api/user/login/',
            {'username': 'username', 'password': 'password'},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

    def test_check(self):
        client, _ = self.ready()

        res = client.get('/api/user/check/')
        self.assertEqual(res.status_code, 200)

    def test_logout(self):
        client, _ = self.ready()

        res = client.get('/api/user/logout/')
        self.assertEqual(res.status_code, 204)

    def test_profile(self):
        client, csrftoken = self.ready()

        res = client.get('/api/user/profile/notfound/')
        self.assertEqual(res.status_code, 404)

        res = client.get('/api/user/profile/username/')
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/user/profile/username2/',
            {
                'oldPassword': 'password',
                'newPassword': 'newpassword',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 403)

        res = client.put(
            '/api/user/profile/username/',
            {
                'oldPassword': 'notpassword',
                'newPassword': 'newpassword',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 401)

        res = client.put(
            '/api/user/profile/username/',
            {
                'oldPassword': 'password',
                'newPassword': 'newpassword',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/user/profile/username/',
            {
                'nickname': 'nickname2',
                'image': 'image.png',
                'gender': 'female',
                'height': 140.6,
                'weight': 55,
                'age': 26,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 409)

        res = client.put(
            '/api/user/profile/username/',
            {},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/user/profile/username/',
            {
                'nickname': 'newnickname',
                'image': 'image.png',
                'gender': 'female',
                'height': 140.6,
                'weight': 55,
                'age': 26,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.delete(
            '/api/user/profile/username2/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 403)

        res = client.delete(
            '/api/user/profile/username/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 204)
