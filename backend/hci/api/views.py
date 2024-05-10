from django.shortcuts import render, HttpResponse
from .models import Group, User
from .serializers import GroupSerializer, UserSerializer
from django.http import  JsonResponse
from rest_framework.parsers import  JSONParser
from django.views.decorators.csrf import csrf_exempt
# Create your views here.

@csrf_exempt
def group_list(request):
    # get all groups
    if request.method == 'GET':
        groups = Group.objects.all()
        # many = True is when you need to serialize queu or set
        serializer = GroupSerializer(groups, many=True)
        return JsonResponse(serializer.data, safe=False)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = GroupSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    
def user_list(request): 
    if request.method == 'GET': 
        users = User.objects.all()
        serailizer = UserSerializer(users, many=True)
        return JsonResponse(serailizer.data, safe=False)
    

@csrf_exempt
def user_details(request, pk):
    try: 
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return HttpResponse(status=404)
    
    if request.method == 'GET':
        serializer =UserSerializer(user)
        return JsonResponse(serializer.data)
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        serializer = UserSerializer(user, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data, status=201)
        return JsonResponse(serializer.errors, status=400)
    elif request.method == 'DELETE':
        user.delete()
        return HttpResponse(status=204)
    

def main_page(request): 
    if request.method == 'GET':
        groups = Group.objects.all()
        # many = True is when you need to serialize queu or set
        serializer = GroupSerializer(groups, many=True)
        return JsonResponse(serializer.data, safe=False)
