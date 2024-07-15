from rest_framework import serializers
from django.contrib.auth.models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

from .models import UserProfile
from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Friends
from django.db.models import Q


class UserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(allow_null=True, required=False)
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'username']

class UserProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = UserProfile
        fields = ['user', 'iban', 'profile_picture']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', None)
        user = instance.user

        if user_data:
            user.first_name = user_data.get('first_name', user.first_name)
            user.last_name = user_data.get('last_name', user.last_name)
            user_email = user_data.get('email', user.email)
            if user_email is not None:
                user.email = user_email
            user.save()

        return super(UserProfileSerializer, self).update(instance, validated_data)


from .models import Expense, Owes

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Expense
        fields = ['id', 'user', 'group', 'name', 'amount']

class OwesSerializer(serializers.Serializer):
    name = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    user_id = serializers.IntegerField(allow_null=True)
    registered = serializers.BooleanField()

class ExpenseDataSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    paidBy = serializers.CharField()
    owes = OwesSerializer(many=True)

    def create(self, validated_data):
        pass

    def update(self, instance, validated_data):
        pass

class CombinedResultSerializer(serializers.Serializer):
    name = serializers.CharField()
    user_id = serializers.IntegerField()
    amount = serializers.IntegerField()
    date_of_registration = serializers.DateTimeField()  # Assuming date_of_registration is a DateTimeField

    def to_representation(self, instance):
        return {
            'name': instance[0],
            'user_id': instance[1]['id'],
            'amount': instance[1]['amount'],
            'date_of_registration': instance[1]['date_of_registration']  # Include date_of_registration field
        }
    

class CombinedResultSerializer2(serializers.Serializer):
    name = serializers.CharField()
    user_id = serializers.IntegerField()
    amount = serializers.IntegerField()
    

    def to_representation(self, instance):
        return {
            'name': instance[0],
            'user_id': instance[1]['id'],
            'amount': instance[1]['amount'],
        }