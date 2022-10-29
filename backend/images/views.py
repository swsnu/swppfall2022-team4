from django.views.decorators.http import require_http_methods
from django.http import HttpResponse, JsonResponse
from django.core.files.storage import FileSystemStorage
from utils.get_random import get_random_string

@require_http_methods(["POST"])
def upload(request):
    """
    이미지를 백엔드 로컬 환경에 업로드합니다.
    """
    try:
        file_type = str(request.FILES['image'].content_type[:6])
        if file_type != 'image/':
            return JsonResponse({"message": "이미지 파일이 아닙니다."}, status=400)
        image_type = str(request.FILES['image'].content_type[6:])
        if image_type not in ['jpg', 'jpeg', 'png']:
            return JsonResponse({"message": "jpg, jpeg, png 파일만 업로드 가능합니다."}, status=400)

        title = get_random_string(30) + '.' + image_type

        FileSystemStorage().save(title, request.FILES['image'])
        return JsonResponse({'title': title}, status=200)

    except Exception:
        return HttpResponse(status=500)
