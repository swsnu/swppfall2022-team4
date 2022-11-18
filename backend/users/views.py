import os
import json
import bcrypt
import jwt
import requests
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from users.models import User
from posts.views import prepare_posts_response
from comments.views import prepare_comment_response


def prepare_login_response(username, nickname, image):
    token = jwt.encode(
        {'username': username},
        os.environ.get("JWT_SECRET"),
        os.environ.get("ALGORITHM"),
    )
    response = JsonResponse(
        {
            "username": username,
            "nickname": nickname,
            "image": image,
        },
        status=200,
    )
    response.set_cookie(
        'access_token',
        token,
        max_age=60 * 60 * 24 * 7,
        samesite='None',
        secure=True,
        httponly=True,
    )
    return response


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

        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode(
            'utf-8'
        )
        User.objects.create(
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
        )

        return prepare_login_response(data['username'], data['nickname'], 'profile_default.jpg')

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
            return prepare_login_response(user.username, user.nickname, user.image)
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
    response.set_cookie(
        'access_token', None, max_age=60 * 60 * 24 * 7, samesite='None', secure=True, httponly=True
    )
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
        return JsonResponse(
            {
                "username": user.username,
                "nickname": user.nickname,
                "image": user.image,
                "gender": user.gender,
                "height": user.height,
                "weight": user.weight,
                "age": user.age,
                "exp": user.exp,
                "level": user.level,
                "created": user.created,
            }
        )

    elif request.method == 'PUT':
        data = json.loads(request.body.decode())
        if request.user.username != user.username:
            return HttpResponse(status=403)

        password = data.get("oldPassword", None)
        new_password = data.get("newPassword", None)
        if password and new_password:
            if bcrypt.checkpw(password.encode('utf-8'), user.hashed_password.encode('utf-8')):
                new_hashed_password = bcrypt.hashpw(
                    new_password.encode('utf-8'), bcrypt.gensalt()
                ).decode('utf-8')
                user.hashed_password = new_hashed_password
                user.save()
            else:
                return JsonResponse({"message": "비밀번호가 틀렸습니다."}, status=401)
        else:
            try:
                if (
                    user.nickname != data['nickname']
                    and (User.objects.filter(nickname=data['nickname'])).exists()
                ):
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

        return prepare_login_response(user.username, user.nickname, user.image)

    elif request.method == 'DELETE':
        if request.user.username != user.username:
            return HttpResponse(status=403)

        user.delete()
        response = HttpResponse(status=204)
        response.set_cookie(
            'access_token',
            None,
            max_age=60 * 60 * 24 * 7,
            samesite='None',
            secure=True,
            httponly=True,
        )
        return response


@require_http_methods(["GET"])
def profile_post(request, user_id):
    """
    GET : 유저가 쓴 글, 댓글, 스크랩 불러오기
    """
    if not (User.objects.filter(username=user_id)).exists():
        return JsonResponse({"message": "존재하지 않는 유저입니다."}, status=404)
    user = User.objects.get(username=user_id)

    posts_serializable = prepare_posts_response(user.posts.all())

    comments = user.comments.all()

    proc_comm = list(comments.values())
    for index, _ in enumerate(proc_comm):
        proc_comm[index] = prepare_comment_response(comments[index])

    scraps_serializable = prepare_posts_response(user.scraped_posts.all())

    return JsonResponse(
        {"posts": posts_serializable, "comments": proc_comm, "scraps": scraps_serializable},
        status=200,
    )


class KakaoException(Exception):
    pass


def kakao_callback(request):
    try:
        rest_api_key = os.environ.get("KAKAO_KEY")
        redirect_uri = 'http://localhost:3000/oauth/kakao/'
        code = request.GET.get("code")
        response_json = requests.get(
            f"https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id={rest_api_key}&redirect_uri={redirect_uri}&code={code}",
            headers={"Content-type": "application/x-www-form-urlencoded;charset=utf-8"},
            timeout=5,
        ).json()

        if response_json.get("error", None) is not None:
            raise KakaoException("Error with authorization.")

        access_token = response_json.get("access_token")
        profile_request = requests.get(
            "https://kapi.kakao.com/v2/user/me",
            headers={
                "Authorization": f"Bearer {access_token}",
                "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
            },
            timeout=5,
        )
        profile_json = profile_request.json()
        properties = profile_json.get("properties")
        username = properties.get("nickname")

        try:
            user = User.objects.get(username=username)
            if user.login_method == User.LOGIN_KAKAO:
                # Login
                return prepare_login_response(user.username, user.nickname, user.image)
            else:
                raise KakaoException(f"Please log in with: {user.login_method}")

        except User.DoesNotExist:
            User.objects.create(
                username=username,
                hashed_password='',
                nickname=username,
                gender='',
                age=0,
                height=0,
                weight=0,
                image='profile_default.png',
                exp=0,
                level=1,
                login_method=User.LOGIN_KAKAO,
            )
            return prepare_login_response(username, username, 'profile_default.png')
    except KakaoException as error:
        print(f"KakaoException. MSG : {str(error)}")
        return HttpResponse(400)
