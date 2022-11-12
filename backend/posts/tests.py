import bcrypt
from django.test import TestCase, Client
from users.models import User
from posts.models import Post
from tags.models import TagClass, Tag
from comments.models import Comment


class PostTestCase(TestCase):
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
        user_other = User.objects.create(
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
        tag_class1 = TagClass.objects.create(class_name="workout", color="#101010")
        TagClass.objects.create(class_name="place", color="#111111")

        tag11 = Tag.objects.create(tag_name="deadlift", tag_class=tag_class1)
        tag12 = Tag.objects.create(tag_name="squat", tag_class=tag_class1)

        post1 = Post.objects.create(
            author=user_me, title="title", content="content", prime_tag=tag11
        )
        post1.tags.add(tag11)
        post1.tags.add(tag12)

        post2 = Post.objects.create(author=user_other, title="other", content="otherContent")
        self.assertEqual(post2.get_eff_like(), 0)
        self.assertEqual(str(post2), 'other')

        comment11 = Comment.objects.create(post=post1, author=user_me, content="Hey")
        Comment.objects.create(
            post=post1, author=user_me, content="Reply", parent_comment=comment11
        )
        comment13 = Comment.objects.create(post=post1, author=user_other, content="Comment2")
        Comment.objects.create(
            post=post1, author=user_other, content="Reply2", parent_comment=comment13
        )

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

    def test_post_main_get(self):
        client, _ = self.ready()

        res = client.get('/api/post/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/?page=1&pageSize=15')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/?page=1&pageSize=15&search=oth')
        self.assertEqual(res.status_code, 200)

    def test_post_main_post(self):
        client, csrftoken = self.ready()

        res = client.post(
            '/api/post/',
            {
                'author_name': 'username',
                'prime_tag': {'id': '1'},
                'tags': [{'id': '1'}, {'id': '2'}],
                'title': 'new by test',
                'content': 'new by test..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            '/api/post/',
            {
                'content': 'new by test..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

    def test_post_detail_get(self):
        client, _ = self.ready()

        res = client.get('/api/post/1/')  # with Prime tag
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/2/')  # without Prime tag
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/3/')  # Not found
        self.assertEqual(res.status_code, 404)

    def test_post_detail_put(self):
        client, csrftoken = self.ready()

        res = client.put(
            '/api/post/1/',
            {
                'prime_tag': {'id': '1'},
                'tags': [{'id': '1'}],
                'title': 'mod by test22',
                'content': 'mod by test22..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/',
            {},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/post/3/',
            {
                'prime_tag': {'id': '1'},
                'tags': [{'id': '1'}],
                'title': 'mod by test22',
                'content': 'mod by test22..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 404)

    # Delete as a final testcase(See bottom)

    def test_post_comment_get(self):
        client, _ = self.ready()

        res = client.get('/api/post/1/comment/')  # with Prime tag
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/3/comment/')  # Not found
        self.assertEqual(res.status_code, 404)

    def test_post_func_put(self):
        client, csrftoken = self.ready()

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'dislike',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'dislike',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'scrap',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'scrap',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/func/',
            {
                'func_type': 'unknown',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/post/3/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 404)

    def test_post_detail_delete(self):
        client, _ = self.ready()

        res = client.delete('/api/post/1/')
        self.assertEqual(res.status_code, 200)

        res = client.delete('/api/post/1/')
        self.assertEqual(res.status_code, 404)  # Already deleted, Not found
