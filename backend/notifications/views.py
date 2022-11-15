import json
from django.core import serializers
from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, HttpResponseBadRequest, JsonResponse
from .models import Notification

@require_http_methods(["GET", "DELETE"])
def index(request):
    """
    GET : 알림 리스트
    DELETE : 알림 삭제
    """
    if request.method == "GET":
        notifications = Notification.objects.filter(user=request.user).order_by('-created')
        data = json.loads(serializers.serialize('json', notifications))
        response = []

        for notification_data in data:
            response.append({
                "id": notification_data['pk'],
                "category": notification_data['fields']['category'],
                "content": notification_data['fields']['content'],
                "image": notification_data['fields']['image'],
                "link": notification_data['fields']['link'],
                "created": notification_data['fields']['created']
            })

    else: # DELETE
        pass

    return JsonResponse(response, safe=False)
