import os
import json
import bcrypt
import jwt
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

        token = jwt.encode(
            {'username': data['username']},
            os.environ.get("JWT_SECRET"),
            os.environ.get("ALGORITHM"),
        )
        response = JsonResponse(
            {
                "username": data['username'],
                "nickname": data['nickname'],
                "image": 'profile_default.png',
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
            token = jwt.encode(
                {'username': data['username']},
                os.environ.get("JWT_SECRET"),
                os.environ.get("ALGORITHM"),
            )
            response = JsonResponse(
                {"username": user.username, "nickname": user.nickname, "image": user.image},
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

        token = jwt.encode(
            {'username': user.username}, os.environ.get("JWT_SECRET"), os.environ.get("ALGORITHM")
        )
        response = JsonResponse(
            {"username": user.username, "nickname": user.nickname, "image": user.image}, status=200
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


@require_http_methods(["POST"])
def follow(request, user_id):
    """
    POST : 팔로우
    """
    data = json.loads(request.body.decode())
    target_username = data["username"]

    if not (User.objects.filter(username=user_id)).exists():
        return JsonResponse({"message": "존재하지 않는 유저입니다."}, status=404)
    target = User.objects.get(username=user_id)

    user = User.objects.get(username=request.user.username)
    user.follower.add(target)
    target.following.add(user)

    return HttpResponse(status=204)


@require_http_methods(["GET"])
def profile_post(request, user_id):
    """
    GET : 유저가 쓴 글, 댓글, 스크랩 불러오기
    """
    if not (User.objects.filter(username=user_id)).exists():
        return JsonResponse({"message": "존재하지 않는 유저입니다."}, status=404)
    user = User.objects.get(username=user_id)

    posts = user.posts.all()

    posts_serializable = list(posts.values())
    for index, _ in enumerate(posts_serializable):
        posts_serializable[index]["comments_num"] = posts[index].get_comments_num()
        posts_serializable[index]["author_name"] = posts[index].author.username
        posts_serializable[index]["like_num"] = posts[index].get_like_num()
        posts_serializable[index]["dislike_num"] = posts[index].get_dislike_num()
        posts_serializable[index]["scrap_num"] = posts[index].get_scrap_num()
        posts_serializable[index]["prime_tag"] = None

        if posts[index].prime_tag:
            posts_serializable[index]["prime_tag"] = {
                "id": posts[index].prime_tag.pk,
                "name": posts[index].prime_tag.tag_name,
                "color": posts[index].prime_tag.tag_class.color,
            }

        del posts_serializable[index]["author_id"]
        del posts_serializable[index]["prime_tag_id"]

    comments = user.comments.all()

    proc_comm = list(comments.values())
    for index, _ in enumerate(proc_comm):
        proc_comm[index]["like_num"] = comments[index].get_like_num()
        proc_comm[index]["dislike_num"] = comments[index].get_dislike_num()
        proc_comm[index]["liked"] = (
            comments[index].liker.all().filter(username=request.user.username).exists()
        )
        proc_comm[index]["disliked"] = (
            comments[index].disliker.all().filter(username=request.user.username).exists()
        )
        proc_comm[index]["author_name"] = comments[index].author.username
        proc_comm[index]["parent_comment"] = proc_comm[index]["parent_comment_id"]
        del proc_comm[index]["author_id"]
        del proc_comm[index]["parent_comment_id"]

    # Re-ordering.
    # comment_reservoir = copy.deepcopy(proc_comm)
    # comment_response = []
    # parent_id = None
    # while len(comment_reservoir) != 0:
    #     proc_comm = copy.deepcopy(comment_reservoir)
    #     for comment in proc_comm:
    #         if parent_id:
    #             if comment["parent_comment"] == parent_id:
    #                 comment_response.append(comment)
    #                 comment_reservoir.remove(comment)
    #         else:
    #             comment_response.append(comment)
    #             parent_id = comment["id"]
    #             comment_reservoir.remove(comment)
    #     parent_id = None

    scraps = user.scraped_posts.all()

    scraps_serializable = list(scraps.values())
    for index, _ in enumerate(scraps_serializable):
        scraps_serializable[index]["comments_num"] = scraps[index].get_comments_num()
        scraps_serializable[index]["author_name"] = scraps[index].author.username
        scraps_serializable[index]["like_num"] = scraps[index].get_like_num()
        scraps_serializable[index]["dislike_num"] = scraps[index].get_dislike_num()
        scraps_serializable[index]["scrap_num"] = scraps[index].get_scrap_num()
        scraps_serializable[index]["prime_tag"] = None

        if scraps[index].prime_tag:
            scraps_serializable[index]["prime_tag"] = {
                "id": scraps[index].prime_tag.pk,
                "name": scraps[index].prime_tag.tag_name,
                "color": scraps[index].prime_tag.tag_class.color,
            }

        del scraps_serializable[index]["author_id"]
        del scraps_serializable[index]["prime_tag_id"]
    return JsonResponse(
        {"posts": posts_serializable, "comments": proc_comm, "scraps": scraps_serializable},
        status=200,
    )
