import bcrypt
from django.test import TestCase, Client
from django.contrib.admin.sites import AdminSite
from users.models import User
from posts.models import Post
from tags.models import TagClass, Tag
from comments.models import Comment
from comments.admin import CommentAdmin


class CommentTestCase(TestCase):
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

        comment11 = Comment.objects.create(post=post1, author=user_me, content="Hey")
        self.assertEqual(comment11.get_eff_like(), 0)
        self.assertEqual(str(comment11), 'Hey')

        Comment.objects.create(
            post=post1, author=user_me, content="Reply", parent_comment=comment11
        )
        comment13 = Comment.objects.create(post=post1, author=user_other, content="Comment2")
        Comment.objects.create(
            post=post1, author=user_other, content="Reply2", parent_comment=comment13
        )

        comment_admin = CommentAdmin(Comment, AdminSite())
        self.assertEqual(comment_admin.get_post_name(comment11), 'title')
        self.assertEqual(comment_admin.get_author_name(comment11), 'username')

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

    def test_comment_main_post(self):
        client, csrftoken = self.ready()

        res = client.post(
            '/api/comment/',
            {
                'content': 'new comment',
                'author_name': 'username',
                'post_id': '1',
                'parent_comment': 'none',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            '/api/comment/',
            {
                'content': 'new comment',
                'author_name': 'username',
                'post_id': '1',
                'parent_comment': '1',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            '/api/comment/',
            {
                'content': 'new comment',
                'author_name': 'username',
                'post_id': '30',
                'parent_comment': 'none',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

    def test_comment_detail_put(self):
        client, csrftoken = self.ready()

        res = client.put(
            '/api/comment/1/',
            {
                'content': 'mod by test22..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/comment/1/',
            {},
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/comment/10/',
            {
                'content': 'mod..',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 404)

    # Delete as a final testcase(See bottom)

    def test_comment_func_put(self):
        client, csrftoken = self.ready()

        res = client.put(
            '/api/comment/1/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/comment/1/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/comment/1/func/',
            {
                'func_type': 'dislike',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/comment/1/func/',
            {
                'func_type': 'dislike',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/comment/1/func/',
            {
                'func_type': 'unknown',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/comment/30/func/',
            {
                'func_type': 'like',
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 404)

    def test_recent_comment_get(self):
        client, _ = self.ready()

        res = client.get('/api/comment/recent/')
        self.assertEqual(res.status_code, 200)

    def test_comment_detail_delete(self):
        client, _ = self.ready()

        res = client.delete('/api/comment/1/')
        self.assertEqual(res.status_code, 200)

        res = client.delete('/api/comment/1/')
        self.assertEqual(res.status_code, 404)  # Already deleted, Not found

        res = client.delete('/api/comment/str/')
        self.assertEqual(res.status_code, 400)
