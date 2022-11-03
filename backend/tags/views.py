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
from tags.models import Tag


@require_http_methods(["GET"])
def tag_home(request):
    """
    GET : Get tag lists.
    """
    tags = Tag.objects.all()

    tags_serializable = list(tags.values())

    response = JsonResponse(
        {
            "tags": tags_serializable,
        },
        status=200,
    )
    return response


# @require_http_methods(["PUT", "DELETE"])
# def comment_detail(request, query_id):
#     """
#     PUT : edit comment.
#     DELETE : delete comment.
#     """
#     if request.method == "PUT":
#         try:
#             data = json.loads(request.body.decode())
#             comment_id = int(query_id)
#             comment_obj = Comment.objects.get(pk=comment_id)

#             comment_obj.content = data["content"]
#             comment_obj.save()
#             return JsonResponse({"message": "success"}, status=200)
#         except Post.DoesNotExist:
#             return HttpResponseNotFound()
#         except Exception as error:
#             print(error)
#             return HttpResponseBadRequest()
#     else:  # request.method == "DELETE":
#         try:
#             comment_id = int(query_id)
#             comment_obj = Comment.objects.get(pk=comment_id)

#             comment_obj.delete()
#             return JsonResponse({"message": "success"}, status=200)
#         except Post.DoesNotExist:
#             return HttpResponseNotFound()
#         except Exception as error:
#             print(error)
#             return HttpResponseBadRequest()


# @require_http_methods(["PUT"])
# def comment_func(request, query_id):
#     """
#     PUT : process given functions.
#     """
#     try:
#         data = json.loads(request.body.decode())
#         comm_id = int(query_id)
#         comm_obj = Comment.objects.get(pk=comm_id)

#         type_of_work = data["func_type"]  # type : like, dislike

#         user = User.objects.get(username=request.user.username)
#         if type_of_work == "like":
#             if comm_obj.liker.all().filter(username=request.user.username).exists():
#                 comm_obj.liker.remove(user)
#             else:
#                 comm_obj.liker.add(user)
#         elif type_of_work == "dislike":
#             if comm_obj.disliker.all().filter(username=request.user.username).exists():
#                 comm_obj.disliker.remove(user)
#             else:
#                 comm_obj.disliker.add(user)
#         else:
#             HttpResponseBadRequest()
#         return JsonResponse({"message": "success"}, status=200)
#     except (Comment.DoesNotExist, User.DoesNotExist):
#         return HttpResponseNotFound()
#     except Exception as error:
#         print(error)
#         return HttpResponseBadRequest()
