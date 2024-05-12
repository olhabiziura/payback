from rest_framework import serializers
from .models import Group, User, Debt


# serializer for Group model
class GroupSerializer(serializers.ModelSerializer):
    # this is modelSerializer, instead of defining fields, we just use them from models.py  
    class Meta: 
        model = Group
        fields = ['id', 'name', 'users', 'amount', 'debts']


# serializer for Custom User model
class UserSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['id', 'username', 'email',  'profilePicture']



class SignupRequestSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['username', 'password', 'email', 'profilePicture']


class LoginRequestSerializer(serializers.ModelSerializer):
    class Meta: 
        model = User
        fields = ['username', 'password']



class DebtSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Debt
        fields = ['id','debts']