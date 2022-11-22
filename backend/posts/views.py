import json
import copy
from django.http import (
    HttpResponseBadRequest,
    HttpResponseNotFound,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from math import ceil
from posts.models import Post, PostImage
from users.models import User
from tags.models import Tag, TagClass

from comments.views import prepare_comment_response


def add_exp(username, exp):
    if User.objects.filter(username=username).exists():
        user = User.objects.get(username=username)
        temp = user.exp + exp
        user.exp = temp % 100
        user.level = user.level + (temp // 100)
        user.save()


def prepare_post_response(post, is_detail, username):
    response = {
        "post_id": post.pk,
        "title": post.title,
        "author": {
            "username": post.author.username,
            "nickname": post.author.nickname,
            "avatar": post.author.image,
            "level": post.author.level,
            "exp": post.author.exp,
        },
        "content": post.content,
        "created": post.created,
        "updated": post.updated,
        "like_num": post.get_like_num(),
        "dislike_num": post.get_dislike_num(),
        "scrap_num": post.get_scrap_num(),
        "comments_num": post.comments.count(),
        "prime_tag": None,
        "has_image": post.images.count() > 0,
    }

    if post.prime_tag:
        response["prime_tag"] = {
            "id": post.prime_tag.pk,
            "name": post.prime_tag.tag_name,
            "color": post.prime_tag.tag_class.color,
        }

    if is_detail:
        response["liked"] = post.liker.all().filter(username=username).exists()
        response["disliked"] = post.disliker.all().filter(username=username).exists()
        response["scraped"] = post.scraper.all().filter(username=username).exists()

        tag_response = []
        for tag in list(post.tags.all().values()):
            tag_class = TagClass.objects.get(pk=tag['tag_class_id'])
            tag_response.append(
                {
                    "id": tag['id'],
                    "name": tag['tag_name'],
                    "color": tag_class.color,
                }
            )
        response["tags"] = tag_response

        image_response = []
        for image in list(post.images.all().values()):
            image_response.append(image["image"])
        response["images"] = image_response

    return response


def prepare_posts_response(posts, is_detail=False, username=""):
    posts_serial = []
    for post in posts:
        posts_serial.append(prepare_post_response(post, is_detail, username))
    return posts_serial


@require_http_methods(["GET", "POST"])
def post_home(request):
    """
    GET : get post list. [ Query = page(1-based indexing), pageSize, search(optional) ]
    POST : create post.
    """
    if request.method == "GET":
        query_args = {}
        query_args["page_num"] = max(int(request.GET.get("page", 1)), 1)
        query_args["page_size"] = max(int(request.GET.get("pageSize", 15)), 15)
        query_args["keyword"] = request.GET.get("search", None)

        offset = (query_args["page_num"] - 1) * query_args["page_size"]
        limit = query_args["page_num"] * query_args["page_size"]

        posts = Post.objects.all()
        if query_args["keyword"]:
            filter_args = {}
            filter_args["title__icontains"] = query_args["keyword"]
            posts = posts.filter(**filter_args)

        posts_serial = prepare_posts_response(posts[offset:limit])

        # Total page number calculation.
        response = JsonResponse(
            {
                "page": query_args["page_num"],
                "page_size": query_args["page_size"],
                "page_total": ceil(posts.count() / query_args["page_size"]),
                "posts": posts_serial,
            },
            status=200,
        )
        return response
    else:  # request.method == "POST":
        try:
            data = json.loads(request.body.decode())
            author = User.objects.get(username=data["author_name"])
            prime_tag = (
                Tag.objects.get(pk=data["prime_tag"]["id"])
                if ("prime_tag" in data.keys() and data["prime_tag"])
                else None
            )

            created_post = Post.objects.create(
                author=author, title=data["title"], content=data["content"], prime_tag=prime_tag
            )
            for tag in data["tags"]:
                tag = Tag.objects.get(pk=tag["id"])
                created_post.tags.add(tag)
            for image in data["images"]:  # image would be string type
                PostImage.objects.create(image=image, post=created_post)

            add_exp(request.user.username, 20)

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
            return JsonResponse(
                prepare_post_response(post_obj, True, request.user.username), status=200
            )
        except Post.DoesNotExist:
            return HttpResponseNotFound()
    elif request.method == "PUT":
        try:
            data = json.loads(request.body.decode())
            post_id = int(query_id)
            post_obj = Post.objects.get(pk=post_id)

            post_obj.title = data["title"]
            post_obj.content = data["content"]
            tags = data["tags"]
            post_obj.prime_tag = (
                Tag.objects.get(pk=data["prime_tag"]["id"])
                if ("prime_tag" in data.keys() and data["prime_tag"])
                else None
            )
            post_obj.tags.clear()
            for tag in tags:
                tag = Tag.objects.get(pk=tag["id"])
                post_obj.tags.add(tag)

            # Image add
            for image in data["images"]:  # image would be string type
                try:
                    PostImage.objects.get(image=image, post=post_obj)
                    # Already there
                except PostImage.DoesNotExist:
                    PostImage.objects.create(image=image, post=post_obj)
            # Image deletion
            for image in post_obj.images.all():
                if image.image not in data["images"]:
                    image.delete()

            post_obj.save()
            return JsonResponse({"message": "success"}, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception:
            return HttpResponseBadRequest()
    else:  # request.method == "DELETE":
        try:
            post_id = int(query_id)
            post_obj = Post.objects.get(pk=post_id)

            post_obj.delete()
            return JsonResponse({"message": "success"}, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()


@require_http_methods(["GET"])
def post_comment(request, query_id):
    """
    GET : get post comment list.
    """
    try:
        post_obj = Post.objects.get(pk=int(query_id))

        comments = post_obj.comments.all()
        proc_comm = list(comments.values())
        for index, _ in enumerate(proc_comm):
            proc_comm[index] = prepare_comment_response(
                comments[index], True, request.user.username
            )

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
                    parent_id = comment["comment_id"]
                    comment_reservoir.remove(comment)
            parent_id = None
        return JsonResponse({"comments": comment_response}, status=200)
    except Post.DoesNotExist:
        return HttpResponseNotFound()


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
            return HttpResponseBadRequest()
        return JsonResponse({"type": type_of_work}, status=200)
    except (Post.DoesNotExist, User.DoesNotExist):
        return HttpResponseNotFound()
