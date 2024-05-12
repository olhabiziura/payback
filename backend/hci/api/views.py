import json
from django.shortcuts import render, HttpResponse
from api.models import Group, User, Debt
from .serializers import GroupSerializer, UserSerializer, LoginRequestSerializer, DebtSerializer, SignupRequestSerializer
from django.core.serializers import serialize, deserialize
from django.http import  JsonResponse
from rest_framework.parsers import  JSONParser
from rest_framework.decorators import api_view, APIView, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework import generics, mixins
from rest_framework import viewsets
from rest_framework.authtoken.models import Token
from rest_framework.authentication import SessionAuthentication,TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


# Create your views here.





@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
        
        return Response("passed for {}".format(request.user.email))




# in case you want to use put to change smth use curl (curl.exe if you use windows) in console (this is cuz this is multipart/form-data): 
# -F is flag for adding or removing fields, like you can remove -F with profilePicture if you dont want to change it
    # curl -X 'PUT'  'http://localhost:8000/users/1'  -H 'accept: application/json'  -H 'Content-Type: multipart/form-data' -F'username=hci' -F 'profilePicture=@C:/Users/mediolanum/Desktop/metamodern/slava.png;type=image/png'          


# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class DebtDetail(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin):
     queryset = Debt.objects.all()
     serializer_class = DebtSerializer

     lookup_field = 'id'
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
    
     def get(self, request, id): 
          return self.retrieve(request)
     
     def post(self, request, id):
        group = self.get_group(id)
        serializer = DebtSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            debt = self.get_debt(serializer.data['id'])
            group.debts = debt  
            group.save()
            return self.create(request)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
     
     def put(self, request, id): 
        group = self.get_group(id)
        request_username = request.data["username"]
        user = self.get_user(request_username)
        debt = group.debts 
        serializer = DebtSerializer(debt, data = request.data)
        if serializer.is_valid():
             group.debts = request.data
             group.save()
             return self.update(request)
        return JsonResponse(serializer.errors, status=400)
    



# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class GroupList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
     queryset = Group.objects.all()
     serializer_class = GroupSerializer

     def get(self, request): 
          return self.list(request)
     
     def post(self, request): 
         return self.create(request)
     
class Signup(generics.GenericAPIView, mixins.CreateModelMixin):
    serializer_class = SignupRequestSerializer
    def post(self, request): 
        serializer = SignupRequestSerializer(data = request.data)
        if serializer.is_valid(): 
             serializer.save()
             user = User.objects.get(username=request.data['username'])
             user.set_password(request.data['password'])
             user.save()
             token = Token.objects.create(user=user)
             return Response({"token":token.key, "user":serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)    


class Login(generics.GenericAPIView, mixins.CreateModelMixin):
    serializer_class = LoginRequestSerializer

    def post(self, request): 
        user = get_object_or_404(User, username = request.data['username'])
        if not user.check_password(request.data['password']):
             return Response({"detail":"Not Found"}, status=status.HTTP_404_NOT_FOUND)
        token, created = Token.objects.get_or_create(user=user)
        serializer = UserSerializer(instance=user)
        return Response({"token":token.key, "user":serializer.data})


# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class UserList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
     queryset = User.objects.all()
     serializer_class = UserSerializer

     def get(self, request): 
          return self.list(request)



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
     
