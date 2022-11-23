import json
from django.http import (
    JsonResponse,
)
from django.views.decorators.http import require_http_methods
from informations.models import Information
from posts.views import prepare_posts_response


@require_http_methods(["GET"])
def information_detail(request, information_name):
    """
    GET : get information detail.
    """
    try:
        target = Information.objects.get(name=information_name)

        return JsonResponse(
            {
                "basic": {"name": information_name},
                "posts": prepare_posts_response(target.tag.tagged_posts.all()),
                "youtubes": 'hey',
                "articles": 'ho',
            },
            status=200,
        )
    except (
        KeyError,
        json.JSONDecodeError,
        Information.DoesNotExist,
    ):
        return JsonResponse({"message": f"Failed {information_name}!"}, status=404)
