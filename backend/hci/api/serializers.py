from rest_framework import serializers
from .models import Group, User

# serializer for Group model
class GroupSerializer(serializers.ModelSerializer):
    # this is modelSerializer, instead of defining fields, we just use them from models.py  
    class Meta: 
        model = Group
        fields = ['id', 'name', 'users', 'amount', 'created', 'debts']

# serializer for User model
# class UserSerializer(serializers.ModelSerializer):
#     class Meta: 
#         model = User
#         fields = ['id', 'username', 'debt', 'groups', 'profilePicture']


# serializer for Custom User model
class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'username', 'debt', 'groups', 'profilePicture', 'date_joined']


class LoginRequestSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['username', 'password']