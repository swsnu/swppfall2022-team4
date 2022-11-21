from django.test import TestCase, Client
from .models import Group
from users.models import User
import bcrypt
import json

class GroupTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create(
                username='user1',
                hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                nickname='user2',
                gender='male',
                age=23,
                height=180,
                weight=75,
                image="profile_default.png",
                exp=0,
                level=1
        )
        user2 = User.objects.create(
                username='user2',
                hashed_password=bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8'),
                nickname='user2',
                gender='male',
                age=23,
                height=180,
                weight=75,
                image="profile_default.png",
                exp=0,
                level=1
        )
        gr1 = Group.objects.create(
            group_name='group1',
            group_leader=user1,
            number=100,
            member_number=2,
            start_date='2019-01-01',
            end_date='2019-12-01',
            description='Testing',
            free=True
        )
        gr1.members.set([user1,user2])
        gr2 = Group.objects.create(
            group_name='group2',
            group_leader=user2,
            number=200,
            member_number=2,
            start_date='2022-01-01',
            end_date='2022-12-01',
            description='Testing2',
            free=True
        )
        gr2.members.set([user1,user2])

        gr3 = Group.objects.create(
            group_name='group3',
            group_leader=user2,
            number=200,
            member_number=2,
            start_date='2022-01-01',
            end_date='2022-12-01',
            description='Testing2',
            free=True
        )
        gr3.members.set([user2])

    def ready(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value
        client.post(
            '/api/user/login/',
            {
                'username': 'user1',
                'password': 'password'
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        return client, csrftoken

    def test_groups(self):
        client, _ = self.ready()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.get('/api/group/')
        self.assertEqual(res.status_code, 200)

        ## 정상 create
        res = client.post('/api/group/',{
            'group_name': 'test1',
            'number': 100,
            'start_date': '2019-01-01',
            'end_date':'2019-12-01',
            'description':'Testing',
            'free':True,
            'goal':[{
               'type':'goal',
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
            )
        self.assertEqual(res.status_code, 201)

        res = client.post('/api/group/',{
            'group_name': 'test2',
            'number': 100,
            'description':'Testing',
            'start_date': None,
            'end_date': None,
            'free':True,
            'goal':[{
               'type':'goal',
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 201)

        res = client.post('/api/group/',{
            'group_name': 'test2',
            'description':'Testing',
            'free':True,
            'start_date': None,
            'end_date': None,
            'number': None,
            'goal':[{
               'type':'goal',
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 201)

        ## body 값이 이상할 때
        res = client.post('/api/group/',{
            'group_name': 'test2',
            'free':True,
            'start_date': None,
            'end_date': None,
            'number': None,
            'goal':[{
               'type':'goal',
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post('/api/group/',{
            'group_name': 'test2',
            'description':'Testing',
            'free':True,
            'start_date': None,
            'end_date': None,
            'number': None,
            'goal':[{
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post('/api/group/',{
            'group_name': 'test2',
            'free':True,
            'description':'Testing',
            'start_date': None,
            'end_date': None,
            'number': None,
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post('/api/group/',{
            'group_name': 'test2',
            'free':True,
            'description':'Testing',
            'start_date': None,
            'number': None,
            'goal':[{
               'type':'goal',
               'workout_type':'실외 걷기',
               'category':'etc',
               'weight':100,
               'rep':10,
               'set':10,
               'time':30
                }],
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

    def test_group_detail(self):
        client, _ = self.ready()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.get('/api/group/1/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/group/10000/')
        self.assertEqual(res.status_code, 404)

        res = client.delete('/api/group/1/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 200)

        res = client.delete('/api/group/2/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 403)

        res = client.delete('/api/group/10000/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 404)

    def test_group_members(self):
        client, _ = self.ready()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value

        res = client.get('/api/group/1/member/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/group/2/member/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/group/3/member/')
        self.assertEqual(res.status_code, 403)

        res = client.get('/api/group/10000/member/')
        self.assertEqual(res.status_code, 404)

        res = client.post('/api/group/3/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 204)

        res = client.post('/api/group/1/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.post('/api/group/10000/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 404)

        res = client.delete('/api/group/3/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 204)

        res = client.delete('/api/group/3/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 400)

        res = client.delete('/api/group/10000/member/',
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        self.assertEqual(res.status_code, 404)

    def test_member_check(self):
        client, _ = self.ready()

        res = client.get('/api/group/1/mem_check/')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/group/1/mem_check/')
        self.assertEqual(json.loads(res.content)["member_status"], "group_leader")

        res = client.get('/api/group/2/mem_check/')
        self.assertEqual(json.loads(res.content)["member_status"], "group_member")

        res = client.get('/api/group/3/mem_check/')
        self.assertEqual(json.loads(res.content)["member_status"], "not_member")

        res = client.get('/api/group/10000/mem_check/')
        self.assertEqual(res.status_code, 404)
