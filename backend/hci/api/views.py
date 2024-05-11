import json
from django.shortcuts import render, HttpResponse
from .models import Group, User
from .serializers import GroupSerializer, UserSerializer, LoginRequestSerializer, DebtSerializer
from django.http import  JsonResponse
from rest_framework.parsers import  JSONParser
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


# API endpoint for login 
class Login(APIView):

    # func for login. for now it uses only username since password is stored in db as hashed value and idk how to hash for now
    # later will be added that fucntionaloty 
    def post(self, request): 
       
        request_username = request.data["username"]
        try: 
             user = User.objects.get(username = request_username)
        except User.DoesNotExist:
             return HttpResponse(status=404)
        serializer = LoginRequestSerializer(user, data = request.data)
        if serializer.is_valid():
             return JsonResponse(serializer.data['username'], status=200, safe=False)
        return JsonResponse(serializer.errors, status=400)


# API endpoint for user with specific id
class UserDetail(APIView):

     # func for getting the user with specific id
    def get_object(self, id):
        try: 
           return User.objects.get(id=id)
        except User.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    # function that returns a group with given id
    def get(self, request, id): 
        user = self.get_object(id)
        serializer = UserSerializer(user)
        return Response(serializer.data)
    
    # function that changes a user with given id based on data presented in request
    def put(self, request, id): 
        user = self.get_object(id)
        serializer = UserSerializer(user, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # function that deletes group with given id 
    def delete(self, request, id):
         user = self.get_object(id)
         user.delete()
         return Response(status=status.HTTP_204_NO_CONTENT)  
# in case you want to use put to change smth use curl (curl.exe if you use windows) in console (this is cuz this is multipart/form-data): 
# -F is flag for adding or removing fields, like you can remove -F with profilePicture if you dont want to change it
    # curl -X 'PUT'  'http://localhost:8000/users/1'  -H 'accept: application/json'  -H 'Content-Type: multipart/form-data' -F'username=hci' -F 'profilePicture=@C:/Users/mediolanum/Desktop/metamodern/slava.png;type=image/png'          


# API endpoint for users
class UserList(APIView):

    # function for getting list of users
    def get(self, request): 
        users = User.objects.all()
        serailizer = UserSerializer(users, many=True)
        return Response(serailizer.data, status=status.HTTP_200_OK)

    # fucntion for adding a new user with data given in a reuqest
    def post(self, request): 
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    

# API endpoint for groups 
class GroupList(APIView):

    # function for getting a list of groups (later will be added possib for returning groups with specific names f.e)
    def get(self, request): 
        groups = Group.objects.all()
        # many = True is when you need to serialize queu or set
        serializer = GroupSerializer(groups, many=True)
        return Response(serializer.data)
    
    # function for adding a new group with data given in a request
    def post(self, request): 
        serializer = GroupSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    


# API endpoint for group with specific id
class GroupDetail(APIView):

    # func for getting the group with specific id
    def get_object(self, id):
        try: 
           return Group.objects.get(id=id)
        except Group.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
    
    # function that returns a group with given id
    def get(self, request, id): 
        group = self.get_object(id)
        serializer = GroupSerializer(group)
        return Response(serializer.data)
    
    # function that changes a group with given id based on data presented in request
    def put(self, request, id): 
        group = self.get_object(id)
        serializer = GroupSerializer(group, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # function that deletes group with given id 
    def delete(self, request, id):
         group = self.get_object(id)
         group.delete()
         return Response(status=status.HTTP_204_NO_CONTENT)    
    


# API endpoint for changing value of debt 
class Debt(APIView):

    # func for getting the group with specific id
    def get_group(self, id):
        try: 
           return Group.objects.get(id=id)
        except Group.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def get_user(self, username): 
        try: 
             return  User.objects.get(username = username)
        except User.DoesNotExist:
             return HttpResponse(status=404)
    
    def put(self, request, id): 
        group = self.get_group(id)
        request_username = request.data["username"]
        user = self.get_user(request_username)
        debt = group.debts 
        serializer = DebtSerializer(debt, data = request.data)
        if serializer.is_valid():
             
             return JsonResponse(serializer.data, status=200, safe=False)
        return JsonResponse(serializer.errors, status=400)