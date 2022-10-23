from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.files.storage import FileSystemStorage
from utils.getRandom import getRandomString

@csrf_exempt
def upload(request):
    try:
        if request.method == 'POST':
            file_type = str(request.FILES['image'].content_type[:6])
            if file_type != 'image/':
                return JsonResponse({"message": "이미지 파일이 아닙니다."}, status=400)
            image_type = str(request.FILES['image'].content_type[6:])
            if image_type not in ['jpg', 'jpeg', 'png']:
                return JsonResponse({"message": "jpg, jpeg, png 파일만 업로드 가능합니다."}, status=400)

            title = getRandomString(30) + '.' + image_type

            FileSystemStorage().save(title, request.FILES['image'])
            return JsonResponse({'title': title}, status=200)
        else:
            return HttpResponse(status=405)
    except Exception:
        return HttpResponse(status=500)