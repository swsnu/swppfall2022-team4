import jwt, os
from django.http import JsonResponse
from django.core.exceptions import PermissionDenied
from jwt.exceptions import ExpiredSignatureError
from users.models import User

def decode_jwt(access_token):
    return jwt.decode(
        access_token,
        os.environ.get("JWT_SECRET"),
        os.environ.get("ALGORITHM")
    )

class JsonWebTokenMiddleWare:

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            if request.path not in ("/api/user/login",
                                    "/api/user/social_login/",
                                    "/api/user/signup/",
                                    "/api/user/token/"):
                access_token = request.COOKIES.get("access_token", None)
                if not access_token:
                    raise PermissionDenied()
                payload = decode_jwt(access_token)
                username = payload.get("username", None)
                if not username:
                    raise PermissionDenied()
                User.objects.get(username=username)
            return self.get_response(request)
        except (PermissionDenied, User.DoesNotExist):
            return JsonResponse({"message": "토큰이 올바르지 않습니다."}, status=401)
        except ExpiredSignatureError:
            return JsonResponse({"message": "토큰이 만료되었습니다."}, status=403)