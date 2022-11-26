import bcrypt
from django.test import TestCase, Client
from users.models import User
from posts.models import Post, PostImage
from tags.models import TagClass, Tag
from comments.models import Comment

POST_HOME = '/api/post/'
POST1_EDIT = '/api/post/1/func/'
TYPE_JSON = 'application/json'
IMAGE1 = '1.png'


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
        PostImage.objects.create(image=IMAGE1, post=post1)
        PostImage.objects.create(image="3232.png", post=post1)

        Post.objects.create(author=user_other, title="other", content="otherContent")

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
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        return client, csrftoken

    def test_model(self):
        post = Post.objects.get(title="title")
        self.assertEqual(post.get_comments_num(), 4)
        self.assertEqual(post.get_eff_like(), 0)
        self.assertEqual(str(post), 'title')

    def test_post_main_get(self):
        client, _ = self.ready()

        res = client.get(POST_HOME)
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/?page=1&pageSize=15')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/?page=1&pageSize=15&search=oth')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/post/?page=1&pageSize=15&search=oth&tag=1&tag=2&tag=333')
        self.assertEqual(res.status_code, 200)

    def test_post_main_post(self):
        client, csrftoken = self.ready()

        res = client.post(
            POST_HOME,
            {
                'author_name': 'username',
                'prime_tag': {'id': '1'},
                'tags': [{'id': '1'}, {'id': '2'}],
                'images': [IMAGE1],
                'title': 'new by test',
                'content': 'new by test..',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 201)

        res = client.post(
            POST_HOME,
            {
                'content': 'new by test..',
            },
            content_type=TYPE_JSON,
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
                'images': [IMAGE1, "2.png"],
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            '/api/post/1/',
            {},
            content_type=TYPE_JSON,
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
                'images': [IMAGE1, "3.png"],
            },
            content_type=TYPE_JSON,
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
            POST1_EDIT,
            {
                'func_type': 'like',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'like',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'dislike',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'dislike',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'scrap',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'scrap',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 200)

        res = client.put(
            POST1_EDIT,
            {
                'func_type': 'unknown',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 400)

        res = client.put(
            '/api/post/3/func/',
            {
                'func_type': 'like',
            },
            content_type=TYPE_JSON,
            HTTP_X_CSRFTOKEN=csrftoken,
        )
        self.assertEqual(res.status_code, 404)

    def test_post_detail_delete(self):
        client, _ = self.ready()

        res = client.delete('/api/post/1/')
        self.assertEqual(res.status_code, 200)

        res = client.delete('/api/post/1/')
        self.assertEqual(res.status_code, 404)  # Already deleted, Not found
