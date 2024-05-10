from rest_framework import serializers
from .models import Group, User

# serializer for Group model
class GroupSerializer(serializers.ModelSerializer):
    # this is modelSerializer, instead of defining fields, we just use them from models.py  
    class Meta: 
        model = Group
        fields = ['id', 'name', 'users']

# serializer for User model
class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'username', 'debt', 'groups']