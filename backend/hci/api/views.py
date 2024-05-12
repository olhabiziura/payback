import json
from django.shortcuts import render, HttpResponse
from api.models import Group, User, Debt
from .serializers import GroupSerializer, UserSerializer, LoginRequestSerializer, DebtSerializer
from django.core.serializers import serialize, deserialize
from django.http import  JsonResponse
from rest_framework.parsers import  JSONParser
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, mixins
from rest_framework import viewsets

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



# in case you want to use put to change smth use curl (curl.exe if you use windows) in console (this is cuz this is multipart/form-data): 
# -F is flag for adding or removing fields, like you can remove -F with profilePicture if you dont want to change it
    # curl -X 'PUT'  'http://localhost:8000/users/1'  -H 'accept: application/json'  -H 'Content-Type: multipart/form-data' -F'username=hci' -F 'profilePicture=@C:/Users/mediolanum/Desktop/metamodern/slava.png;type=image/png'          




# API endpoint for changing value of debt 
class DebtDetail(APIView):

    def get_debt(self, id):
        try: 
            return Debt.objects.get(id = id)
        except Debt.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
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
    
    def post(self,request, id): 
        group = self.get_group(id)
        serializer = DebtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            debt = self.get_debt(serializer.data['id'])
            group.debts = debt  
            return Response(status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  
    


    def put(self, request, id): 
        group = self.get_group(id)
        request_username = request.data["username"]
        user = self.get_user(request_username)
        debt = group.debts 
        serializer = DebtSerializer(debt, data = request.data)
        if serializer.is_valid():

             return JsonResponse(serializer.data, status=200, safe=False)
        return JsonResponse(serializer.errors, status=400)


# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class GroupList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
     queryset = Group.objects.all()
     serializer_class = GroupSerializer

     def get(self, request): 
          return self.list(request)
     
     def post(self, request): 
         return self.create(request)
     


# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class UserList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
     queryset = User.objects.all()
     serializer_class = UserSerializer

     def get(self, request): 
          return self.list(request)
     
     def post(self, request): 
         return self.create(request)
     


class UserDetailViewSet(viewsets.GenericViewSet, mixins.RetrieveModelMixin ,  mixins.UpdateModelMixin, mixins.DestroyModelMixin, mixins.ListModelMixin, mixins.CreateModelMixin):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# API endpoint for getting details about the user with given id. 
class UserDetail(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
     queryset = User.objects.all()
     serializer_class = UserSerializer

    # otherwise it will look up for pk
     lookup_field = 'id'

     def get(self, request, id): 
          return self.retrieve(request, id = id)
     
     def put(self, request, id): 
         return self.update(request, id = id)
     
     def delete(self, request, id):
         return self.destroy(request, id = id)
     

# API endpoint for getting details about the group with given id. 
class GroupDetail(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
     queryset = Group.objects.all()
     serializer_class = GroupSerializer

    # otherwise it will look up for pk
     lookup_field = 'id'

     def get(self, request, id): 
          return self.retrieve(request, id = id)
     
     def put(self, request, id): 
         return self.update(request, id = id)
     
     def delete(self, request, id):
         return self.destroy(request, id = id)
     
