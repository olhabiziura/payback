import json
from django.shortcuts import render, HttpResponse
from .models import Group, User
from .serializers import GroupSerializer, UserSerializer, LoginRequestSerializer
from django.http import  JsonResponse
from rest_framework.parsers import  JSONParser
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
# Create your views here.

@api_view(['GET', 'POST'])
def group_list(request):
    # get all groups
    if request.method == 'GET':
        groups = Group.objects.all()
        # many = True is when you need to serialize queu or set
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data, safe=False)
    elif request.method == 'POST':
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
def user_list(request): 
    if request.method == 'GET': 
        users = User.objects.all()
        serailizer = UserSerializer(users, many=True)
        return JsonResponse(serailizer.data, safe=False)
    


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
        
# login endpoint - use POST method with username and password in body, for now i only check for username and dont compare password since 
# password in DB is stored as hashed value and idk how to do it now 
@api_view(['GET', 'POST'])
def login(request): 
    if request.method == 'POST': 
        data = json.loads(request.body) 

        request_username = data["username"]
        try: 
             user = User.objects.get(username = request_username)
        except User.DoesNotExist:
             return HttpResponse(status=404)
        serializer = LoginRequestSerializer(user, data = data)
        if serializer.is_valid():
             print(serializer.data['username'])
             return JsonResponse(serializer.data['username'], status=200, safe=False)
        return JsonResponse(serializer.errors, status=400)