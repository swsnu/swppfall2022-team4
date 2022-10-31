import os
import json
import bcrypt
import jwt
import datetime
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from .models import User

@ensure_csrf_cookie
@require_http_methods(["GET"])
def set_csrf(request):
    """
    GET : csrf 설정
    """
    return HttpResponse(status=200)

@require_http_methods(["POST"])
def signup(request):
    """
    POST : 회원가입
    """
    try:
        data = json.loads(request.body.decode())

        if (User.objects.filter(username=data['username'])).exists():
            return JsonResponse({"message": "이미 있는 유저네임입니다."}, status=409)
        if (User.objects.filter(nickname=data['nickname'])).exists():
            return JsonResponse({"message": "이미 있는 닉네임입니다."}, status=409)

        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'),
                                        bcrypt.gensalt()).decode('utf-8')
        User(
            username=data['username'],
            hashed_password=hashed_password,
            nickname=data['nickname'],
            gender=data['gender'],
            age=data['age'],
            height=data['height'],
            weight=data['weight'],
            image="profile_default.png",
            exp=0,
            level=1,
            created=datetime.date.today(),
        ).save()

        token = jwt.encode({'username': data['username']},
                           os.environ.get("JWT_SECRET"),
                           os.environ.get("ALGORITHM"))
        response = JsonResponse({"username": data['username'],
                                 "nickname": data['nickname'],
                                 "image": 'profile_default.png'},
                                status=200)
        response.set_cookie('access_token',
                            token,
                            max_age=60 * 60 * 24 * 7,
                            samesite='None',
                            secure=True,
                            httponly=True)
        return response

    except (KeyError, json.JSONDecodeError):
        return HttpResponseBadRequest()

@require_http_methods(["POST"])
def login(request):
    """
    POST : 로그인
    """
    try:
        data = json.loads(request.body.decode())

        if data['username'] == "":
            return JsonResponse({"message": "유저네임을 입력하세요."}, status=400)
        if data['password'] == "":
            return JsonResponse({"message": "비밀번호를 입력하세요."}, status=400)
        if not (User.objects.filter(username=data['username'])).exists():
            return JsonResponse({"message": "존재하지 않는 유저네임입니다."}, status=401)

        user = User.objects.get(username=data['username'])
        if bcrypt.checkpw(data['password'].encode('utf-8'), user.hashed_password.encode('utf-8')):
            token = jwt.encode({'username': data['username']},
                               os.environ.get("JWT_SECRET"),
                               os.environ.get("ALGORITHM"))
            response = JsonResponse({"username": user.username,
                                     "nickname": user.nickname,
                                     "image": user.image},
                                    status=200)
            response.set_cookie('access_token',
                                token,
                                max_age=60 * 60 * 24 * 7,
                                samesite='None',
                                secure=True,
                                httponly=True)
            return response
        else:
            return JsonResponse({"message": "비밀번호가 틀렸습니다."}, status=401)

    except (KeyError, json.JSONDecodeError):
        return HttpResponseBadRequest()

@require_http_methods(["GET"])
def check(request):
    """
    GET : 자동 로그인을 위한 토큰 확인
    """
    return HttpResponse(status=200)

@require_http_methods(["GET"])
def logout(request):
    """
    GET : 로그아웃, 쿠키 삭제
    """
    response = HttpResponse(status=204)
    response.set_cookie('access_token', None, max_age=60 * 60 * 24 * 7, samesite='None', secure=True, httponly=True)
    return response

@require_http_methods(["GET", "PUT", "DELETE"])
def profile(request, user_id):
    """
    GET : 프로필 불러오기
    PUT : 프로필 수정
    DELETE : 회원 탈퇴
    """
    if not (User.objects.filter(username=user_id)).exists():
        return JsonResponse({"message": "존재하지 않는 유저입니다."}, status=404)
    user = User.objects.get(username=user_id)

    if request.method == 'GET':
        return JsonResponse({
            "username": user.username,
            "nickname": user.nickname,
            "image": user.image,
            "gender": user.gender,
            "height": user.height,
            "weight": user.weight,
            "age": user.age,
            "exp": user.exp,
            "level": user.level,
            "created": user.created
        })

    elif request.method == 'PUT':
        data = json.loads(request.body.decode())
        if request.user.username != user.username:
            return HttpResponse(status=403)

        password = data.get("oldPassword", None)
        new_password = data.get("newPassword", None)
        if password and new_password:
            if bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
                new_hashed_password = bcrypt.hashpw(
                    new_password.encode('utf-8'),
                    bcrypt.gensalt()
                ).decode('utf-8')
                user.hashed_password = new_hashed_password
                user.save()
            else:
                return JsonResponse({"message": "비밀번호가 틀렸습니다."}, status=401)
        else:
            try:
                if user.nickname != data['nickname'] \
                    and (User.objects.filter(nickname=data['nickname'])).exists():
                    return JsonResponse({"message": "이미 있는 닉네임입니다."}, status=409)
                user.nickname = data['nickname']
                user.image = data['image']
                user.gender = data['gender']
                user.height = data['height']
                user.weight = data['weight']
                user.age = data['age']
                user.save()
            except KeyError:
                return HttpResponseBadRequest()

        token = jwt.encode(
            {'username': user.username},
            os.environ.get("JWT_SECRET"),
            os.environ.get("ALGORITHM")
        )
        response = JsonResponse(
            {
                "username": user.username,
                "nickname": user.nickname,
                "image": user.image
            },
            status=200
        )
        response.set_cookie(
            'access_token',
            token,
            max_age=60 * 60 * 24 * 7,
            samesite='None',
            secure=True,
            httponly=True
        )
        return response

    elif request.method == 'DELETE':
        if request.user.username != user.username:
            return HttpResponse(status=403)

        user.delete()
        response = HttpResponse(status=204)
        response.set_cookie('access_token', None, max_age=60 * 60 * 24 * 7, samesite='None', secure=True, httponly=True)
        return response
