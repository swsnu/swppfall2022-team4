import json
from django.http import (
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from posts.models import Post
from comments.models import Comment
from users.models import User


def add_exp(username, exp):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        temp = user.exp + exp
        user.exp = temp % 100
        user.level = user.level + (temp // 100)
        user.save()


def prepare_comment_response(comment, is_detail=False, username=''):
    response = {
        "post_id": comment.post.pk,
        "comment_id": comment.pk,
        "author": {
            "username": comment.author.username,
            "nickname": comment.author.nickname,
            "avatar": comment.author.image,
            "level": comment.author.level,
            "exp": comment.author.exp,
        },
        "content": comment.content,
        "created": comment.created,
        "updated": comment.updated,
        "like_num": comment.get_like_num(),
        "dislike_num": comment.get_dislike_num(),
        "parent_comment": comment.parent_comment.pk if comment.parent_comment else None,
    }

    if is_detail:
        response["liked"] = comment.liker.all().filter(username=username).exists()
        response["disliked"] = comment.disliker.all().filter(username=username).exists()
    return response


def prepare_comments_response(comments, is_detail=False, username=''):
    comments_serial = []
    for comment in comments:
        comments_serial.append(prepare_comment_response(comment, is_detail, username))
    return comments_serial

@require_http_methods(["POST"])
def comment_home(request):
    """
    POST : create comment.
    """
    try:
        data = json.loads(request.body.decode())

        content = data["content"]
        author_name = data["author_name"]
        post_id = int(data["post_id"])
        parent_comment = data["parent_comment"]

        author = User.objects.get(username=author_name)
        post = Post.objects.get(pk=post_id)

        if parent_comment == "none":
            Comment.objects.create(author=author, post=post, content=content, parent_comment=None)
        else:
            parent_comment = Comment.objects.get(pk=parent_comment)
            Comment.objects.create(
                author=author, post=post, content=content, parent_comment=parent_comment
            )

        add_exp(request.user.username, 5)

        return JsonResponse({"message": "Success!"}, status=201)
    except (
        KeyError,
        json.JSONDecodeError,
        User.DoesNotExist,
        Post.DoesNotExist,
    ):
        return HttpResponseBadRequest()


@require_http_methods(["PUT", "DELETE"])
def comment_detail(request, query_id):
    """
    PUT : edit comment.
    DELETE : delete comment.
    """
    if request.method == "PUT":
        try:
            data = json.loads(request.body.decode())
            comment_id = int(query_id)
            comment_obj = Comment.objects.get(pk=comment_id)

            comment_obj.content = data["content"]
            comment_obj.save()
            return JsonResponse({"message": "success"}, status=200)
        except Comment.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()
    else:  # request.method == "DELETE":
        try:
            comment_id = int(query_id)
            comment_obj = Comment.objects.get(pk=comment_id)

            comment_obj.delete()
            return JsonResponse({"message": "success"}, status=200)
        except Comment.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()


@require_http_methods(["PUT"])
def comment_func(request, query_id):
    """
    PUT : process given functions.
    """
    try:
        data = json.loads(request.body.decode())
        comm_id = int(query_id)
        comm_obj = Comment.objects.get(pk=comm_id)

        type_of_work = data["func_type"]  # type : like, dislike

        user = User.objects.get(username=request.user.username)
        if type_of_work == "like":
            if comm_obj.liker.all().filter(username=request.user.username).exists():
                comm_obj.liker.remove(user)
            else:
                comm_obj.liker.add(user)
        elif type_of_work == "dislike":
            if comm_obj.disliker.all().filter(username=request.user.username).exists():
                comm_obj.disliker.remove(user)
            else:
                comm_obj.disliker.add(user)
        else:
            return HttpResponseBadRequest()
        return JsonResponse({"type": type_of_work}, status=200)
    except (Comment.DoesNotExist, User.DoesNotExist):
        return HttpResponseNotFound()


@require_http_methods(["GET"])
def recent_comment(request):
    """
    GET : get recent comment list.
    """
    comments = Comment.objects.order_by("-created")[0:10]
    proc_comm = list(comments.values())
    for index, _ in enumerate(proc_comm):
        proc_comm[index] = prepare_comment_response(comments[index])
    return JsonResponse({"comments": proc_comm}, status=200)
