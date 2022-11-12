import bcrypt
from django.test import TestCase, Client
from users.models import User
from posts.models import Post
from tags.models import TagClass, Tag

from utils.get_random import get_random_color


class TagTestCase(TestCase):
    def setUp(self):
        user_me = User.objects.create(
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

        tag_class1 = TagClass.objects.create(class_name="workout", color="#101010")
        self.assertEqual(str(tag_class1), 'workout')

        TagClass.objects.create(class_name="place", color="#111111")

        tag11 = Tag.objects.create(tag_name="deadlift", tag_class=tag_class1)
        self.assertEqual(str(tag11), 'deadlift')

        tag12 = Tag.objects.create(tag_name="squat", tag_class=tag_class1)

        post1 = Post.objects.create(
            author=user_me, title="title", content="content", prime_tag=tag11
        )
        post1.tags.add(tag11)
        post1.tags.add(tag12)

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

    def test_tag_home_get(self):
        client, _ = self.ready()

        res = client.get(
            '/api/tag/',
        )
        self.assertEqual(res.status_code, 200)

    def test_tag_home_post(self):
        client, csrftoken = self.ready()

        res = client.post(
            '/api/tag/',
            {
                'name': 'tagname',
                'classId': '1',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            '/api/tag/',
            {},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

    def test_tag_class_post(self):
        client, csrftoken = self.ready()

        res = client.post(
            '/api/tag/class/',
            {
                'name': 'tagname',
                'color': '#101010',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            '/api/tag/class/',
            {},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        self.assertEqual(type(get_random_color()), type('str'))

    def test_tag_search_get(self):
        client, _ = self.ready()

        res = client.get('/api/tag/search/')
        self.assertEqual(res.status_code, 400)

        res = client.get('/api/tag/search/?tag=dead')
        self.assertEqual(res.status_code, 200)
