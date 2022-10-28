from django.shortcuts import render
from django.http import HttpResponseNotAllowed, JsonResponse
# from .models import Group

# def group_list(request):
#     if request.method == 'GET':
#         group_list = [group for group in Group.objects.all()]
#         return JsonResponse(group_list, safe=False)
#     else:
#         return HttpResponseNotAllowed(['GET'])
