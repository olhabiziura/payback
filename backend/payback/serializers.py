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


class UserProfileSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='user.first_name', required=False)
    surname = serializers.CharField(source='user.last_name', required=False)
    email = serializers.EmailField(source='user.email', required=False)
    friends = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['profile_picture', 'iban', 'name', 'surname', 'email', 'friends']

    def get_friends(self, obj):
        # Get friends of the user
        friends = Friends.objects.filter(Q(user1=obj.user) | Q(user2=obj.user))
        # Serialize friends data
        friend_data = [{'id': friend.id, 'username': friend.user1.username if friend.user2 == obj.user else friend.user2.username} for friend in friends]
        return friend_data

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        user = instance.user

        user.first_name = user_data.get('first_name', user.first_name)
        user.last_name = user_data.get('last_name', user.last_name)
        user.email = user_data.get('email', user.email)
        user.save()

        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        instance.iban = validated_data.get('iban', instance.iban)
        instance.save()

        return instance


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
    amount = serializers.IntegerField()  # Assuming amount is an integer

    def to_representation(self, instance):
        return {
            'name': instance[0],
            'user_id': instance[1]['id'],
            'amount': instance[1]['amount']
        }