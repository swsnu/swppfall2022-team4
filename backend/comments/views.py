import json
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from posts.models import Post
from comments.models import Comment
from users.models import User


@require_http_methods(["GET", "POST"])
def comment_home(request):
    """
    GET : get comment list. [ Query = page(1-based indexing), pageSize ]
    POST : create comment.
    """
    if request.method == "GET":
        # page_num = int(request.GET.get("page", 1))
        # if page_num <= 0:
        #     page_num = 1
        # page_size = int(request.GET.get("pageSize", 10))
        # page_size = max(page_size, 10)

        # offset = (page_num - 1) * page_size
        # limit = page_num * page_size

        # posts = Post.objects.all()[offset:limit]
        # posts_serializable = list(posts.values())
        # for index, _ in enumerate(posts_serializable):
        #     posts_serializable[index]["comments_num"] = posts[index].get_comments_num()
        #     del posts_serializable[index]["author_id"]
        #     posts_serializable[index]["author_name"] = posts[index].author.username

        # # Total page number calculation.
        # response = JsonResponse(
        #     {
        #         "page": page_num,
        #         "page_size": page_size,
        #         "page_total": ceil(Post.objects.count() / page_size),
        #         "posts": posts_serializable,
        #     },
        #     status=200,
        # )
        # return response
        return HttpResponse("Not implemented", status=404)
    else:  # request.method == "POST":
        try:
            data = json.loads(request.body.decode())

            content = data["content"]
            author_name = data["author_name"]
            post_id = int(data["post_id"])
            parent_comment = data["parent_comment"]

            author = User.objects.get(username=author_name)
            post = Post.objects.get(pk=post_id)

            if parent_comment == "none":
                Comment.objects.create(
                    author=author, post=post, content=content, parent_comment=None
                )
            return JsonResponse({"message": "Success!"}, status=201)
        except (
            KeyError,
            json.JSONDecodeError,
            User.DoesNotExist,
            Post.DoesNotExist,
        ):
            return HttpResponseBadRequest()
