import json
from django.http import (
    HttpResponseBadRequest,
    JsonResponse,
)
from django.db.models import Count
from django.views.decorators.http import require_http_methods
from tags.models import Tag, TagClass
from tags.management.commands.prepare_tags import get_tag_class_type
from informations.models import Information


# tag_visual : [ id, name, color ]
def prepare_tag_response(tag_visual, calories, tag_type, post_num=None):
    base_structure = {
        "id": tag_visual[0],
        "name": tag_visual[1],
        "color": tag_visual[2],
        "type": tag_type,
    }
    if calories is not None:
        base_structure["calories"] = calories
    if post_num is not None:
        base_structure["posts"] = post_num
    return base_structure


CALORIES_DEFAULT = 0.073529412


@require_http_methods(["GET", "POST"])
def tag_home(request):
    """
    GET : Get tag list.
    POST : Create tag.
    """
    if request.method == "GET":
        tag_classes = TagClass.objects.all()
        tag_classes_serializable = list(tag_classes.values())

        for index, _ in enumerate(tag_classes_serializable):
            tag_visual_list = []
            for tag in tag_classes[index].tags.all():
                tag_visual_list.append(
                    prepare_tag_response(
                        [tag.pk, tag.tag_name, tag_classes[index].color],
                        tag.calories,
                        tag_classes[index].class_type,
                    )
                )
            tag_classes_serializable[index]["tags"] = tag_visual_list

        popular_tags = []
        for tag in Tag.objects.annotate(p_count=Count('tagged_posts')).order_by('-p_count')[:10]:
            popular_tags.append(
                prepare_tag_response(
                    [tag.pk, tag.tag_name, tag.tag_class.color],
                    tag.calories,
                    tag.tag_class.class_type,
                    tag.tagged_posts.count(),
                )
            )

        response = JsonResponse(
            {
                "tags": tag_classes_serializable,
                "popularTags": popular_tags,
            },
            status=200,
        )
        return response
    else:  # POST
        try:
            data = json.loads(request.body.decode())

            tag_name = data["name"]
            parent_class = TagClass.objects.get(pk=data["classId"])
            created_tag = Tag.objects.create(tag_name=tag_name, tag_class=parent_class)

            if get_tag_class_type(parent_class.class_name) == 'workout':
                Information.objects.create(name=tag_name, tag=created_tag)
            return JsonResponse(
                {
                    "tags": prepare_tag_response(
                        [created_tag.pk, tag_name, parent_class.color],
                        CALORIES_DEFAULT,
                        parent_class.class_type,
                    ),
                },
                status=201,
            )
        except (KeyError, json.JSONDecodeError, TagClass.DoesNotExist):
            return HttpResponseBadRequest()


@require_http_methods(["POST"])
def tag_class(request):
    """
    POST : Create tag class.
    """
    try:
        data = json.loads(request.body.decode())

        class_name = data["name"]
        class_color = data["color"]
        new_class = TagClass.objects.create(class_name=class_name, color=class_color)

        return JsonResponse(
            {
                "tag_class": {
                    "id": new_class.pk,
                    "class_name": new_class.class_name,
                    "class_type": new_class.class_type,  # All classes are GENERAL.
                    "color": new_class.color,
                    "tags": [],
                }
            },
            status=201,
        )
    except (KeyError, json.JSONDecodeError):
        return HttpResponseBadRequest()


@require_http_methods(["GET"])
def tag_search(request):
    """
    GET : Get searched tag list.
    """
    query_args = {}
    query_args["class_name"] = request.GET.get("class", None)
    query_args["tag_name"] = request.GET.get("tag", None)

    tags = Tag.objects.all()

    if query_args["class_name"] or query_args["tag_name"]:
        # This is for searching tags.
        filter_args = {}
        filter_args["tag_name__icontains"] = query_args["tag_name"]
        filtered_tags = tags.filter(**filter_args)

        tags_serializable = list(
            filtered_tags.values()
        )  # id, created, updated, tag_name, tag_class_id
        for index, item in enumerate(tags_serializable):
            belong_class = TagClass.objects.get(pk=item["tag_class_id"])
            tags_serializable[index]["name"] = item["tag_name"]
            tags_serializable[index]["color"] = belong_class.color

            del tags_serializable[index]["tag_name"]
            del tags_serializable[index]["tag_class_id"]
        response = JsonResponse(
            {
                "tags": tags_serializable,
            },
            status=200,
        )
        return response
    else:
        return HttpResponseBadRequest()
