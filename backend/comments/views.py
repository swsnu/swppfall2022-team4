import json
import copy
from django.http import (
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from posts.models import Post
from comments.models import Comment
from users.models import User


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
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as error:
            print(error)
            return HttpResponseBadRequest()
    else:  # request.method == "DELETE":
        try:
            comment_id = int(query_id)
            comment_obj = Comment.objects.get(pk=comment_id)

            comment_obj.delete()
            return JsonResponse({"message": "success"}, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as error:
            print(error)
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
            HttpResponseBadRequest()
        return JsonResponse({"message": "success"}, status=200)
    except (Comment.DoesNotExist, User.DoesNotExist):
        return HttpResponseNotFound()
    except Exception as error:
        print(error)
        return HttpResponseBadRequest()


@require_http_methods(["GET"])
def recent_comment(request):
    """
    GET : get recent comment list.
    """
    try:
        comments = Comment.objects.order_by("-created")
        print(comments)
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
        comment_reservoir = copy.deepcopy(proc_comm)
        comment_response = []
        parent_id = None
        while len(comment_reservoir) != 0:
            proc_comm = copy.deepcopy(comment_reservoir)
            for comment in proc_comm:
                if parent_id:
                    if comment["parent_comment"] == parent_id:
                        comment_response.append(comment)
                        comment_reservoir.remove(comment)
                else:
                    comment_response.append(comment)
                    parent_id = comment["id"]
                    comment_reservoir.remove(comment)
            parent_id = None
        return JsonResponse({"comments": comment_response}, status=200)
    except Post.DoesNotExist:
        return HttpResponseNotFound()
    except Exception as error:
        print(error)
        return HttpResponseBadRequest()
