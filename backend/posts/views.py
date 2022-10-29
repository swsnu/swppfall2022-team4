import json
from os import stat
from django.http import HttpResponseBadRequest, HttpResponseNotAllowed, HttpResponseNotFound, JsonResponse
from django.core import serializers
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
            posts_serializable[index]["comments_num"] = posts[index].get_comments_num()
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
    
def postDetail(request, id):
    """
        GET : get post detail.
        PUT : edit post.
        DELETE : delete post.
    """
    if request.method == "GET":
        try:
            print(id)
            post_id = int(id)
            post_obj = Post.objects.get(pk=post_id)

            post_response = {
                "id" : post_obj.pk,
                "title" : post_obj.title,
                "author_name" : post_obj.author.username,
                "content" : post_obj.content,
                "created" : post_obj.created,
                "updated" : post_obj.updated,
                "like_num" : post_obj.like_num,
                "dislike_num" : post_obj.dislike_num,
                "scrap_num" : post_obj.scrap_num,
                "comments_num" : post_obj.comments.count()
            }
            return JsonResponse(post_response, status=200)
        except Post.DoesNotExist:
            return HttpResponseNotFound()
        except Exception as e:
            print(e)
            return HttpResponseBadRequest()
    elif request.method == "PUT":
        pass
    elif request.method == "DELETE":
        pass
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', "DELETE"])