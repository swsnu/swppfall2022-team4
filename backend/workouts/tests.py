import bcrypt
import time
from django.test import TestCase, Client
from users.models import User
from .models import FitElement, Routine, DailyLog


class WorkoutTestCase(TestCase):
    def setUp(self):
        User.objects.create(
            username='username',
            hashed_password=bcrypt.hashpw('password'.encode(
                'utf-8'), bcrypt.gensalt()).decode('utf-8'),
            nickname='nickname',
            gender='male',
            age=23,
            height=180,
            weight=75,
            image="profile_default.png",
            exp=0,
            level=1
        )
        fit_element = FitElement.objects.create(
            author_id=1,
            type="log",
            workout_type="leg",
            period=0,
            category="category",
            weight=0,
            rep=0,
            set=0,
            time=0,
            date='2022-10-01'
        )
        routine = Routine.objects.create(
            author_id=1,
            name="routine_test",
        )
        routine.fit_element.add(fit_element)
        daily_log = DailyLog.objects.create(
            author_id=1,
            date='2022-10-1',
            memo='memo',
        )
        daily_log.fit_element.add(fit_element)

    def ready(self):
        client = Client()
        token_response = client.get('/api/user/token/')
        csrftoken = token_response.cookies['csrftoken'].value
        client.post(
            '/api/user/login/',
            {
                'username': 'username',
                'password': 'password'
            },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken
        )
        return client, csrftoken

    def test_create_fit_element(self):
        client, csrftoken = self.ready()
        res = client.post('/api/fitelement/', {
            'user_id': 1,
            'type': 'log',
            'workout_type': 'test',
            'period': 0,
            'category': 'test',
            'weight': 0,
            'rep': 0,
            'set': 0,
            'time': 0,
            'date': '2022-10-1'
        },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(res.status_code, 201)

        res = client.post('/api/fitelement/', {
            'user_id': 1,
            'type': 'log',
            'workout_type': 'test',
            'period': 0,
            'category': 'test',
            'weight': 0,
            'rep': 0,
            'set': 0,
            'time': 0,
            'date': '2022-10-2'
        },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(res.status_code, 201)

        res = client.post('/api/fitelement/', {
            'user_id': 1,
            'type': 'log',
        },
            content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)

        self.assertEqual(res.status_code, 400)

    def test_get_fit_element(self):
        client, _ = self.ready()
        res = client.get('/api/fitelement/1/')
        self.assertEqual(res.status_code, 201)

        res = client.get('/api/fitelement/10/')
        self.assertEqual(res.status_code, 404)

    def test_get_calendar_info(self):
        client, _ = self.ready()
        res = client.get('/api/fitelement/2022/10/?&user_id=1')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/fitelement/2022/12/')
        self.assertEqual(res.status_code, 200)

    def test_get_routines(self):
        client, _ = self.ready()
        res = client.get('/api/fitelement/routine/?&user_id=1')
        self.assertEqual(res.status_code, 200)

    def test_get_routine(self):
        client, _ = self.ready()
        res = client.get('/api/fitelement/routine/1/')
        self.assertEqual(res.status_code, 201)

        res = client.get('/api/fitelement/routine/10/')
        self.assertEqual(res.status_code, 400)

    def test_get_daily_log(self):
        client, _ = self.ready()
        res = client.get('/api/fitelement/dailylog/2022/10/1/?&user_id=1')
        self.assertEqual(res.status_code, 200)

        res = client.get('/api/fitelement/dailylog/2022/10/5/?&user_id=1')
        self.assertEqual(res.status_code, 200)

    def test_create_routine(self):
        client, csrftoken = self.ready()
        res = client.post('/api/fitelement/routine/?&user_id=1', {
            'user_id': 1,
            'fitelements': [1]
        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 201)

    def test_create_daily_log(self):
        client, csrftoken = self.ready()
        res = client.post('/api/fitelement/dailylog/2022/10/5/?&user_id=1', {
            'user_id': 1,
            'memo': 'test',
            'date': '2022-10-05'

        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 201)

    def test_edit_daily_log(self):
        client, csrftoken = self.ready()
        res = client.put('/api/fitelement/dailylog/2022/10/5/?&user_id=1', {
            'user_id': 1,
            'memo': 'test',
        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 201)

        res = client.put('/api/fitelement/dailylog/2022/10/6/?&user_id=1', {
            'user_id': 1,
            'fitelements': [1]
        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 200)

        res = client.put('/api/fitelement/dailylog/2022/10/1/?&user_id=1', {
            'user_id': 1,
            'memo': 'test',
        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 201)

        res = client.put('/api/fitelement/dailylog/2022/10/1/?&user_id=1', {
            'user_id': 1,
            'fitelements': [1]
        }, content_type='application/json',
            HTTP_X_CSRFTOKEN=csrftoken)
        self.assertEqual(res.status_code, 200)
