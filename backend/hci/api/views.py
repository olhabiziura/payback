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
import logging


# Create your views here.
logger = logging.getLogger(__name__)




@api_view(['GET'])
@authentication_classes([SessionAuthentication, TokenAuthentication])
@permission_classes([IsAuthenticated])
def test_token(request):
        
        return Response("passed for {}".format(request.user.email))




# in case you want to use put to change smth use curl (curl.exe if you use windows) in console (this is cuz this is multipart/form-data): 
# -F is flag for adding or removing fields, like you can remove -F with profilePicture if you dont want to change it
    # curl -X 'PUT'  'http://localhost:8000/users/1'  -H 'accept: application/json'  -H 'Content-Type: multipart/form-data' -F'username=hci' -F 'profilePicture=@C:/Users/mediolanum/Desktop/metamodern/slava.png;type=image/png'          


# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class DebtDetail(generics.GenericAPIView, mixins.RetrieveModelMixin, mixins.DestroyModelMixin, mixins.UpdateModelMixin):
     queryset = Debt.objects.all()
     serializer_class = DebtSerializer

     def get_debt(self,group_id, debt_id):
        try: 
            group = Group.objects.get(id = group_id)
            if  group.debts.get(id = debt_id).exists(): 
                 debt = group.debts.get(id = debt_id)
                 serializer = DebtSerializer(debt)
                 return serializer
            return Response(status=status.HTTP_404_NOT_FOUND)
            
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
    
     def get(self, request, group_id, debt_id): 
          try: 
            if not Group.objects.filter(id = group_id):
                return Response({"message": "group with given group_id does not exists"}, status=status.HTTP_404_NOT_FOUND)
            group = Group.objects.get(id = group_id)
            if   group.debts.filter(id = debt_id).exists():
                 debt = group.debts.get(id = debt_id)
                 serializer = DebtSerializer(debt)
                 return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({"message": "debt with given debt_id does not belong to group"}, status=status.HTTP_404_NOT_FOUND)
             
          except Debt.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

     
     def delete(self, request, group_id, debt_id):
         return self.destroy(request,id = debt_id)
     
     def put(self, request, group_id, debt_id): 
        group = self.get_group(group_id)
        serializer = DebtSerializer(group.debts.set(Debt).get(id=debt_id), data = request.data     )
        if serializer.is_valid():
             group.debts = request.data
             group.save()
             return self.update(request)
        return JsonResponse(serializer.errors, status=400)
     
# API endpoint for listing a list of all users || later will be added fucn for filtering the list and getting list of specific users
class DebtList(generics.GenericAPIView, mixins.ListModelMixin, mixins.CreateModelMixin):
     queryset = Debt.objects.all() 
     serializer_class = DebtSerializer
     
     lookup_field = "group_id"
    # func for getting the group with specific id
     def get_group(self, id):
        try: 
           return Group.objects.get(id=id)
        except Group.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

     def get(self, request, group_id): 
          group = self.get_group(group_id)
          if group.debts: 
               for i in group.debts.all():
                   i.save()
               serializer = DebtSerializer(group.debts, many=True)

               return Response(serializer.data, status=status.HTTP_200_OK)
          else: 
                return Response({"message": "No data available"}, status=status.HTTP_200_OK)
     
     def post(self, request, group_id): 
        logger.debug("POST request received")
        group = self.get_group(group_id)
        serializer = DebtSerializer(data=request.data)
        if serializer.is_valid():
            debt = serializer.save()
            group.debts.add(debt)  
            logger.debug("Debt added to group")
            if debt.check_owner() == False or debt.check_participants() == False:
                debt.delete_self()
                return Response({"message": "user owner or participants are not in the group"}, status=status.HTTP_400_BAD_REQUEST)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
             serializer = UserSerializer(user)
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
     lookup_field = 'group_id'

     def get(self, request, group_id): 
          group = Group.objects.get(id=group_id)
          serializer = GroupSerializer(group)
          return Response(serializer.data, status=status.HTTP_200_OK)
     
     def put(self, request, group_id): 
         return self.update(request, id = group_id)
     
     def delete(self, request, group_id):
         return self.destroy(request, id = group_id)
   