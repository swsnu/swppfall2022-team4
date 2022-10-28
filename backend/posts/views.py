import json
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, JsonResponse
from math import ceil
from .models import Post
from users import models as user_model

def postHome(request):
    """
        GET : get post list. [ Query = page(1-based indexing), pageSize ]
        POST : create post.
    """
    if request.method == 'GET':
        page_num = int(request.GET.get('page', 1))
        if page_num <= 0:
            page_num = 1
        page_size = int(request.GET.get('pageSize', 10))
        if page_size < 10:
            page_size = 10

        offset = (page_num - 1) * page_size
        limit = page_num * page_size

        posts = Post.objects.all()[offset:limit]
        posts_serializable = [post for post in posts.values()]
        for index, _ in enumerate(posts_serializable):
            posts_serializable[index]["comments"] = posts[index].get_comments_num()
            del posts_serializable[index]["author_id"]
            posts_serializable[index]["author_name"] = posts[index].author.username
        
        # Total page number calculation.
        totalPost = Post.objects.count()
        page_total = ceil(totalPost / page_size)
        response = JsonResponse({"page": page_num,
                                "page_size": page_size,
                                "page_total": page_total,
                                "posts": posts_serializable},
                                status=200)
        return response
    elif request.method == 'POST':
        try:
            data = json.loads(request.body.decode()) 
            
            title = data["title"]
            content = data["content"]
            author_name = data["author_name"]
            
            author = user_model.User.objects.get(username=author_name)
            Post.objects.create(
                author = author,
                title = title,
                content = content
            )
            return JsonResponse({"message": "Success!"}, status=201)
            # data should have user, post info.
        except (KeyError, json.JSONDecodeError, user_model.User.DoesNotExist):
            return HttpResponseBadRequest()
    else:
        return HttpResponseNotAllowed(['GET', 'POST'])