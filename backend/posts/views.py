import json
import copy
from django.http import (
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from math import ceil
from posts.models import Post
from users import models as user_model


@require_http_methods(["GET", "POST"])
def post_home(request):
    """
    GET : get post list. [ Query = page(1-based indexing), pageSize ]
    POST : create post.
    """
    if request.method == "GET":
        page_num = int(request.GET.get("page", 1))
        if page_num <= 0:
            page_num = 1
        page_size = int(request.GET.get("pageSize", 10))
        page_size = max(page_size, 10)

        offset = (page_num - 1) * page_size
        limit = page_num * page_size

        posts = Post.objects.all()[offset:limit]
        posts_serializable = list(posts.values())
        for index, _ in enumerate(posts_serializable):
            posts_serializable[index]["comments_num"] = posts[index].get_comments_num()
            del posts_serializable[index]["author_id"]
            posts_serializable[index]["author_name"] = posts[index].author.username

        # Total page number calculation.
        response = JsonResponse(
            {
                "page": page_num,
                "page_size": page_size,
                "page_total": ceil(Post.objects.count() / page_size),
                "posts": posts_serializable,
            },
            status=200,
        )
        return response
    else:  # request.method == "POST":
        try:
            data = json.loads(request.body.decode())

            title = data["title"]
            content = data["content"]
            author_name = data["author_name"]

            author = user_model.User.objects.get(username=author_name)
            created_post = Post.objects.create(
                author=author, title=title, content=content
            )
            return JsonResponse({"post_id": str(created_post.pk)}, status=201)
            # data should have user, post info.
        except (KeyError, json.JSONDecodeError, user_model.User.DoesNotExist):
            return HttpResponseBadRequest()


@require_http_methods(["GET", "PUT", "DELETE"])
def post_detail(request, query_id):
    """
    GET : get post detail.
    PUT : edit post.
    DELETE : delete post.
    """
    if request.method == "GET":
        try:
            post_id = int(query_id)
            post_obj = Post.objects.get(pk=post_id)

            post_response = {
                "id": post_obj.pk,
                "title": post_obj.title,
                "author_name": post_obj.author.username,
                "content": post_obj.content,
                "created": post_obj.created,
                "updated": post_obj.updated,
                "like_num": post_obj.like_num,
                "dislike_num": post_obj.dislike_num,
                "scrap_num": post_obj.scrap_num,
                "comments_num": post_obj.comments.count(),
            }
            return JsonResponse(post_response, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as error:
            print(error)
            return HttpResponseBadRequest()
    elif request.method == "PUT":
        try:
            data = json.loads(request.body.decode())
            post_id = int(query_id)
            post_obj = Post.objects.get(pk=post_id)

            post_obj.title = data["title"]
            post_obj.content = data["content"]
            post_obj.save()
            return JsonResponse({"message": "success"}, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as error:
            print(error)
            return HttpResponseBadRequest()
    else:  # request.method == "DELETE":
        try:
            post_id = int(query_id)
            post_obj = Post.objects.get(pk=post_id)

            post_obj.delete()
            return JsonResponse({"message": "success"}, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as error:
            print(error)
            return HttpResponseBadRequest()


@require_http_methods(["GET"])
def post_comment(request, query_id):
    """
    GET : get post comment list.
    """
    try:
        post_id = int(query_id)
        post_obj = Post.objects.get(pk=post_id)

        comments = post_obj.comments.all()
        processed_comment = list(comments.values())
        for index, _ in enumerate(processed_comment):
            del processed_comment[index]["author_id"]
            processed_comment[index]["author_name"] = comments[index].author.username
            processed_comment[index]["parent_comment"] = processed_comment[index][
                "parent_comment_id"
            ]
            processed_comment[index]["replyActive"] = False
            del processed_comment[index]["parent_comment_id"]

        # Re-ordering.
        comment_reservoir = copy.deepcopy(processed_comment)
        comment_response = []
        parent_id = None
        while len(comment_reservoir) != 0:
            processed_comment = copy.deepcopy(comment_reservoir)
            for comment in processed_comment:
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
