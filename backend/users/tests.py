import os
import jwt
import bcrypt
import datetime
from django.test import TestCase, Client
from users.models import User
from posts.models import Post
from tags.models import TagClass, Tag
from comments.models import Comment


class UserTestCase(TestCase):
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
        user2 = User.objects.create(
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
        user1.follower.add(user2)
        user1.following.add(user2)

        tag_class1 = TagClass.objects.create(class_name="workout", color="#101010")
        tag11 = Tag.objects.create(tag_name="deadlift", tag_class=tag_class1)
        post1 = Post.objects.create(
            author=user1, title="post1", content="content", prime_tag=tag11
        )
        Comment.objects.create(
            post=post1, author=user1, content="comment1"
        )
        post1.scraper.add(user1)


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

        token = jwt.encode(
            {},
            os.environ.get("JWT_SECRET", "jwt_secret_for_development_jwt_secret_for_development_jwt_secret_for_development_jwt_secret_for_development_jwt_secret_for_development"),
            os.environ.get("ALGORITHM", "HS256")
        )
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
        self.assertIn("post1", res.content.decode())
        self.assertIn("comment1", res.content.decode())

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

    def test_follow(self):
        client, _ = self.ready()

        res = client.get('/api/user/follow/notfound/')
        self.assertEqual(res.status_code, 404)

        res = client.get('/api/user/follow/username2/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/user/follow/username2/')
        self.assertEqual(res.status_code, 200)
