from .models import User

@require_http_methods(["GET", "DELETE"])
def index():
    """
    GET : 알림 리스트
    DELETE : 알림 삭제
    """
    print(request.user.username)
    return HttpResponse(status=200)
