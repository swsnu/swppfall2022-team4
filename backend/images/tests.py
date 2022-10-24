from django.test import TestCase, Client

class ImageTestCase(TestCase):

    def test_upload(self):
        client = Client()

        with open('images/test/test.txt', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image})
        self.assertEqual(response.status_code, 400)

        with open('images/test/test.bmp', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image})
        self.assertEqual(response.status_code, 400)

        with open('images/test/test.jpg', 'rb') as test_image:
            response = client.put('/api/image/', {'image': test_image})
        self.assertEqual(response.status_code, 405)

        response = client.post('/api/image/', {'image': 'error'})
        self.assertEqual(response.status_code, 500)

        with open('images/test/test.jpg', 'rb') as test_image:
            response = client.post('/api/image/', {'image': test_image})
        self.assertEqual(response.status_code, 200)
