import json
from django.http import (
    HttpResponseBadRequest,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from tags.models import Tag, TagClass


@require_http_methods(["GET", "POST"])
def tag_home(request):
    """
    GET : Get tag lists.
    """
    if request.method == "GET":
        tag_classes = TagClass.objects.all()
        tag_classes_serializable = list(tag_classes.values())
        for index, _ in enumerate(tag_classes_serializable):
            tag_classes_serializable[index]["tags"] = list(tag_classes[index].tags.values())
        response = JsonResponse(
            {
                "tags": tag_classes_serializable,
            },
            status=200,
        )
        return response
    else:  # POST
        try:
            data = json.loads(request.body.decode())

            tag_name = data["name"]
            class_id = data["classId"]
            parent_class = TagClass.objects.get(pk=class_id)
            Tag.objects.create(tag_name=tag_name, tag_class=parent_class)
            return JsonResponse({"message": "Success!"}, status=201)
        except (KeyError, json.JSONDecodeError, TagClass.DoesNotExist):
            return HttpResponseBadRequest()


@require_http_methods(["POST"])
def tag_class(request):
    """
    GET : Get tag lists.
    """
    try:
        data = json.loads(request.body.decode())

        class_name = data["name"]
        class_color = data["color"]
        TagClass.objects.create(class_name=class_name, color=class_color)
        return JsonResponse({"message": "Success!"}, status=201)
    except (KeyError, json.JSONDecodeError):
        return HttpResponseBadRequest()


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
