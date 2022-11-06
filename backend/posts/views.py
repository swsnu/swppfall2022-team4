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
from users.models import User
from tags.models import Tag, TagClass


@require_http_methods(["GET", "POST"])
def post_home(request):
    """
    GET : get post list. [ Query = page(1-based indexing), pageSize, search(optional) ]
    POST : create post.
    """
    if request.method == "GET":
        query_args = {}
        query_args["page_num"] = max(int(request.GET.get("page", 1)), 1)
        query_args["page_size"] = max(int(request.GET.get("pageSize", 10)), 10)
        query_args["keyword"] = request.GET.get("search", None)

        offset = (query_args["page_num"] - 1) * query_args["page_size"]
        limit = query_args["page_num"] * query_args["page_size"]

        if query_args["keyword"]:
            filter_args = {}
            filter_args["title__icontains"] = query_args["keyword"]
            posts = Post.objects.all().filter(**filter_args)[offset:limit]
        else:
            posts = Post.objects.all()[offset:limit]

        posts_serializable = list(posts.values())
        for index, _ in enumerate(posts_serializable):
            posts_serializable[index]["comments_num"] = posts[index].get_comments_num()
            posts_serializable[index]["author_name"] = posts[index].author.username
            posts_serializable[index]["like_num"] = posts[index].get_like_num()
            posts_serializable[index]["dislike_num"] = posts[index].get_dislike_num()
            posts_serializable[index]["scrap_num"] = posts[index].get_scrap_num()

            if posts[index].prime_tag:
                posts_serializable[index]["prime_tag"] = {
                    "id": posts[index].prime_tag.pk,
                    "name": posts[index].prime_tag.tag_name,
                    "color": posts[index].prime_tag.tag_class.color,
                }
            else:
                posts_serializable[index]["prime_tag"] = None

            del posts_serializable[index]["author_id"]
            del posts_serializable[index]["prime_tag_id"]

        # Total page number calculation.
        response = JsonResponse(
            {
                "page": query_args["page_num"],
                "page_size": query_args["page_size"],
                "page_total": ceil(Post.objects.count() / query_args["page_size"]),
                "posts": posts_serializable,
            },
            status=200,
        )
        return response
    else:  # request.method == "POST":
        try:
            data = json.loads(request.body.decode())

            author = User.objects.get(username=data["author_name"])
            prime_tag = Tag.objects.get(pk=data["prime_tag"]["id"])
            created_post = Post.objects.create(
                author=author, title=data["title"], content=data["content"], prime_tag=prime_tag
            )
            for tag in data["tags"]:
                tag = Tag.objects.get(pk=tag["id"])
                created_post.tags.add(tag)
            return JsonResponse({"post_id": str(created_post.pk)}, status=201)
            # data should have user, post info.
        except (KeyError, json.JSONDecodeError, User.DoesNotExist, Tag.DoesNotExist):
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

            tag_response = []
            for tag in list(post_obj.tags.all().values()):
                tag_class = TagClass.objects.get(pk=tag['tag_class_id'])
                tag_response.append(
                    {
                        "id": tag['id'],
                        "name": tag['tag_name'],
                        "color": tag_class.color,
                    }
                )

            prime_tag_response = {
                "id": post_obj.prime_tag.pk,
                "name": post_obj.prime_tag.tag_name,
                "color": post_obj.prime_tag.tag_class.color,
            }

            post_response = {
                "id": post_obj.pk,
                "title": post_obj.title,
                "author_name": post_obj.author.username,
                "content": post_obj.content,
                "created": post_obj.created,
                "updated": post_obj.updated,
                "like_num": post_obj.get_like_num(),
                "dislike_num": post_obj.get_dislike_num(),
                "scrap_num": post_obj.get_scrap_num(),
                "comments_num": post_obj.comments.count(),
                "liked": post_obj.liker.all().filter(username=request.user.username).exists(),
                "disliked": post_obj.disliker.all().filter(username=request.user.username).exists(),
                "scraped": post_obj.scraper.all().filter(username=request.user.username).exists(),
                "tags": tag_response,
                "prime_tag": prime_tag_response,
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
            tags = data["tags"]
            post_obj.prime_tag = Tag.objects.get(pk=data["prime_tag"]["id"])
            post_obj.tags.clear()
            for tag in tags:
                tag = Tag.objects.get(pk=tag["id"])
                post_obj.tags.add(tag)
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


@require_http_methods(["PUT"])
def post_func(request, query_id):
    """
    PUT : process given functions.
    """
    try:
        data = json.loads(request.body.decode())
        post_id = int(query_id)
        post_obj = Post.objects.get(pk=post_id)

        type_of_work = data["func_type"]  # type : like, dislike, scrap

        user = User.objects.get(username=request.user.username)
        if type_of_work == "like":
            if post_obj.liker.all().filter(username=request.user.username).exists():
                post_obj.liker.remove(user)
            else:
                post_obj.liker.add(user)
        elif type_of_work == "dislike":
            if post_obj.disliker.all().filter(username=request.user.username).exists():
                post_obj.disliker.remove(user)
            else:
                post_obj.disliker.add(user)
        elif type_of_work == "scrap":
            if post_obj.scraper.all().filter(username=request.user.username).exists():
                post_obj.scraper.remove(user)
            else:
                post_obj.scraper.add(user)
        else:
            HttpResponseBadRequest()
        return JsonResponse({"message": "success"}, status=200)
    except (Post.DoesNotExist, User.DoesNotExist):
        return HttpResponseNotFound()
    except Exception as error:
        print(error)
        return HttpResponseBadRequest()
