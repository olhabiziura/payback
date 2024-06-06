from django.shortcuts import HttpResponse
from rest_framework import generics
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserProfileSerializer, ExpenseSerializer, ExpenseDataSerializer, OwesSerializer, CombinedResultSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from .models import UserGroup, User, Group, UserProfile, Membership, Owes, Expense
from django.views.decorators.csrf import csrf_exempt
import json
from .forms import UserProfileForm
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, permission_classes, authentication_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from rest_framework.generics import CreateAPIView
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.exceptions import ObjectDoesNotExist

from decimal import Decimal
# Create your views here.
def Index(request):
    return HttpResponse("It's working")
class RegisterView(CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        # Call super to perform the default creation process
        user = serializer.save()
        # Create a UserProfile instance for the newly registered user
        profile_data = {'user': user.id, 'profile_picture': ''}
        profile_serializer = UserProfileSerializer(data=profile_data)
        if profile_serializer.is_valid():
            profile_serializer.save()
        else:
            print('Validation errors:', profile_serializer.errors)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def protected_view(request):
    return Response({"message": "This is a protected view"})

@receiver(post_save, sender=User)
def create_or_update_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)
    instance.userprofile.save()

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_groups(request):
    user = request.user  # Assuming user is authenticated
    user_groups = Membership.objects.filter(user =user)
    print([ug.group.name for ug in user_groups])
    groups = [{'id': ug.group.id, 'name': ug.group.name} for ug in user_groups]
    return JsonResponse({'groups': groups})

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def create_group(request):
    try:
        user = request.user
        data = json.loads(request.body)
        group_name = data.get('name')
        members = data.get('members', [])
        print(members)
        if not group_name:
            return JsonResponse({'error': 'Group name is required.'}, status=400)

        user = User.objects.get(id=user.id)
        group = Group.objects.create(name=group_name)
        #UserGroup.objects.create(user=user, group=group)

        # Create Membership objects for each member
        for member in members:
          
            if member['id'] is not None:
     
                # If member is an ID, link it to an existing user
                try:
                    member_user = User.objects.get(id=member['id'])
                    print(member_user.id)
                    Membership.objects.create(user=member_user, group=group, name = member_user.username)
                except User.DoesNotExist:
                    return JsonResponse({'error': f"User with ID {member} does not exist."}, status=400)
            else:
                # If member is not an ID, assume it's a user name (for non-registered users)
                Membership.objects.create(group=group, name=member['name'])
        Membership.objects.create(user=user, group=group, name = user.id)
        return JsonResponse({'id': group.id, 'name': group.name}, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

        
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def delete_groups(request):
        group_ids = request.data.get('groupIds',[])
        try:
            # Delete the groups from the database
            Group.objects.filter(id__in=group_ids).delete()
            # Respond with a success message
            return JsonResponse({'message': 'Groups deleted successfully'}, status=200)
        except Exception as e:
            # If an error occurs, respond with an error message
            return JsonResponse({'error': str(e)}, status=500)
 
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_profile(request):
    try:
        user = request.user
        user_data = {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            # Add any other user fields you want to include
        }
        return JsonResponse(user_data, status=200)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_profile(request):
    try:
        user_profile = UserProfile.objects.get(user=request.user)
    except UserProfile.DoesNotExist:
        user_profile = UserProfile(user=request.user)

    # Handle the incoming data properly
    data = {
        'iban': request.data.get('iban'),
        'user': {
            'first_name': request.data.get('name'),
            'last_name': request.data.get('surname'),
            'email': request.data.get('email'),
        }
    }

    # If a profile picture is uploaded, add it to the data
    if 'profile_picture' in request.FILES:
        data['profile_picture'] = request.FILES['profile_picture']

    serializer = UserProfileSerializer(user_profile, data=data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Profile updated successfully'}, status=200)
    else:
        print("Serializer Errors:", serializer.errors)  # Debugging statement
        return Response(serializer.errors, status=400)

from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes

from rest_framework.permissions import IsAuthenticated
from .models import UserProfile
from .serializers import UserProfileSerializer

from django.db.models import Q

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_profile_data(request, user_id):
    try:
        # Fetch user profile data
        
        user_profile = User.objects.get(id=user_id)
        profile = UserProfile.objects.get(user=user_profile)
        serializer = UserProfileSerializer(profile)
        response_data = serializer.data
 
        # Add profile picture URL to the response
        response_data['profile_picture'] = request.build_absolute_uri(profile.profile_picture.url) if profile.profile_picture else None

        # Fetch list of friends (id and username)
        friends = Friends.objects.filter(Q(user1=user_profile) | Q(user2=user_profile)).values('user1', 'user2')
        friend_ids = set()
        friend_list = []

        # Extract friend ids and remove the current user's id
        for friend in friends:
            if friend['user1'] != user_profile.id:
                friend_ids.add(friend['user1'])
            if friend['user2'] != user_profile.id:
                friend_ids.add(friend['user2'])

        # Fetch usernames of friends
        friends_queryset = User.objects.filter(id__in=friend_ids)
        for friend in friends_queryset:
            friend_list.append({'id': friend.id, 'name': friend.username})

        response_data['friends'] = friend_list

        return Response(response_data, status=200)
    except (User.DoesNotExist, UserProfile.DoesNotExist):
        return Response({'error': 'User profile does not exist'}, status=404)

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_friends_list(request):
    try:
        # Fetch the user's friends
        user_profile = request.user
        friends = Friends.objects.filter(Q(user1=user_profile) | Q(user2=user_profile)).values('user1', 'user2')
        friend_ids = set()

        # Extract friend ids and remove the current user's id
        for friend in friends:
            if friend['user1'] != user_profile.id:
                friend_ids.add(friend['user1'])
            if friend['user2'] != user_profile.id:
                friend_ids.add(friend['user2'])

        # Fetch usernames of friends
        friends_queryset = User.objects.filter(id__in=friend_ids)
        friend_list = [{'id': friend.id, 'name': friend.username} for friend in friends_queryset]

        return Response({'friends': friend_list}, status=200)
    except User.DoesNotExist:
        return Response({'error': 'User does not exist'}, status=404)
    


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_group_details(request, group_id):
    try:
        # Fetch group details by ID
        group = Group.objects.get(id=group_id)
        group_data = {
            'id': group.id,
            'name': group.name,
            # Add more group details here if needed
        }

        # Fetch member names associated with the group
        members = Membership.objects.filter(group=group)
        member_data = [{'id': member.id, 'name': member.name} for member in members]

        # Include member names in group data
        group_data['members'] = member_data
        expenses = Expense.objects.filter(group=group)
        expense_data = [{'id': expense.id, 'name': expense.name, 'amount': expense.amount, 'user_id': expense.user_id} for expense in expenses]

        # Include expense data in group data
        group_data['expenses'] = expense_data

        return JsonResponse(group_data, status=200)
    except Group.DoesNotExist:
        return JsonResponse({'error': 'Group not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@api_view(['PUT'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_group_members(request, group_id):
    try:
        
        group = Group.objects.get(id=group_id)
        new_members = request.data.get('members', [])

        # Get current members
        current_memberships = Membership.objects.filter(group=group)
        current_members = {m.user.id: m for m in current_memberships if m.user}
        current_names = {m.name: m for m in current_memberships if m.name}

        # Remove members not in the new list
        for member in current_memberships:
            if member.user and str(member.user.id) not in new_members:
                member.delete()
            if member.name and member.name not in new_members:
                member.delete()

        # Add new members
        for member in new_members:
            if member.isdigit():
                user = User.objects.get(id=member)
                if user.id not in current_members:
                    Membership.objects.create(group=group, user=user)
            else:
                if member not in current_names:
                    Membership.objects.create(group=group, name=member)

        return Response({'message': 'Group members updated successfully'}, status=200)
    except Group.DoesNotExist:
        return Response({'error': 'Group not found'}, status=404)
    except Exception as e:
        return Response({'error': str(e)}, status=500)




@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_expense(request, group_id):
    try:
        
        data = request.data
        expense_name = data.get('name')
        expense_amount = Decimal(data.get('amount'))
        user_id = request.user.id  # Assuming user is authenticated
        
        member_ids = data.get('owes', [])
        print(member_ids)
        # Validate input data
        if not expense_name or expense_amount <= 0 or not member_ids:
            return JsonResponse({'error': 'Invalid input data'}, status=400)
      
        # Create the expense
        expense = Expense.objects.create(
            name=expense_name,
            amount=expense_amount,
            user_id=user_id,
            group_id=group_id
        )
       
        # Calculate the amount for each member in Owes
        num_members = len(member_ids)
        if num_members > 0:
            amount_per_member = expense_amount / num_members
                
            # Add members to the Owes model
            for member_id in member_ids:
                owes = Owes.objects.create(
                    expense=expense,
                    member_id=member_id,
                    user_id=None,  # Set user_id to None initially
                    amount=amount_per_member
                )
                # Set user_id if the member has a linked user
                if owes.member.user:
                    owes.user_id = owes.member.user.id
                    owes.save()
            
        # Serialize the expense data for response
        serializer = ExpenseSerializer(expense)
        return JsonResponse(serializer.data, status=201)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


from rest_framework.response import Response

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_expense_details(request, expense_id):
    try:
        expense = Expense.objects.get(id=expense_id)
        payer = User.objects.get(id=expense.user.id)
        
        # Create an instance of ExpenseSerializer to serialize the expense data
        expense_serializer = ExpenseSerializer(expense)

        expense_data = expense_serializer.data
        
        # Add 'paidBy' field to expense_data
        expense_data['paidBy'] = payer.username

        # Fetch the Owes data for the expense
        owes = Owes.objects.filter(expense=expense)
        owes_data = []
        for owe in owes:
            member = owe.member
            membership = Membership.objects.filter(id=owe.member_id).first()
            
            if membership and membership.user_id:
                owes_data.append({
                    'name': member.name,
                    'amount': owe.amount,
                    'user_id': membership.user_id,
                    'registered': True if membership.name else False
                })
            else:
                owes_data.append({
                    'name': member.name,
                    'amount': owe.amount,
                    'user_id': None,
                    'registered': False
                })
        expense_data['owes'] = owes_data
        print(owes_data)
        # Create an instance of ExpenseDataSerializer with the updated expense_data
        serializer = ExpenseDataSerializer(data=expense_data)
        serializer.is_valid(raise_exception=True)  # Validate the data
       
        # Return the serialized data as a JSON response
        return Response(serializer.validated_data, status=200)
    except Expense.DoesNotExist:
        return JsonResponse({'error': 'Expense not found'}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def search_users(request):
    if 'query' in request.GET:
        query = request.GET['query']
        # Search users by username containing the query string
        users = User.objects.filter(username__icontains=query)[:5]  # Limit to first 5 results
        user_data = [{'id': user.id, 'username': user.username} for user in users]
        return JsonResponse(user_data, safe=False)
    else:
        return JsonResponse({'error': 'Query parameter "query" is required'}, status=400)




from rest_framework import status
from .models import Friends
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@api_view(['POST'])
def add_friend(request):
    if request.method == 'POST':
        friend_id = request.data.get('friendId')
        friend = User.objects.get( id = friend_id)
        user = request.user
        user_id = user.id

        # Check if the friend already exists
        existing_friend = Friends.objects.filter(user1=user, user2=friend).exists() or Friends.objects.filter(user1=friend, user2=user).exists()
        if existing_friend:
            return Response({'message': 'Friend already exists'}, status=status.HTTP_400_BAD_REQUEST)
        print("jkhbklhbS")
        # Create a new friendship record
        friend_record = Friends.objects.create(user1=user, user2=friend)
        return Response({'message': 'Friend added successfully'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


def get_owed_to_user(request):
    user_id = request.user.id
    expenses = Expense.objects.filter(user_id=user_id)
    expense_ids = expenses.values_list('id', flat=True)
    owes = Owes.objects.filter(expense_id__in=expense_ids)
    result = []

    for owe in owes:
        member = get_object_or_404(Membership, id=owe.member_id)
        if member.user_id is None:
            membership = get_object_or_404(Membership, id=member.id)
            group = get_object_or_404(Group, id=membership.group_id)
            member_name = f"{member.name} ({group.name})"
            member_id = None
        else:
            member_name = member.name
            member_id = member.user_id

        result.append({
            'name': member_name,
            'id': member_id,
            'amount': owe.amount
        })

    combined_result = {}
    for record in result:
        if record['id'] is not None:
            if record['id'] in combined_result:
                combined_result[record['id']]['amount'] += record['amount']
            else:
                combined_result[record['id']] = record
        else:
            combined_result[f"{record['name']}_group"] = record

    final_result = list(combined_result.values())
    print(final_result)
    return final_result

def get_user_ows(request):
    owes_records = Owes.objects.filter(user_id=request.user.id)
    result = []

    for owe in owes_records:
        expense = get_object_or_404(Expense, id=owe.expense_id)
        owed_to_user = get_object_or_404(User, id=expense.user_id)

        result.append({
            'name': owed_to_user.username,
            'id': owed_to_user.id,
            'amount': owe.amount
        })

    combined_result = {}
    for record in result:
        if record['id'] in combined_result:
            combined_result[record['id']]['amount'] += record['amount']
        else:
            combined_result[record['id']] = record

    final_result = list(combined_result.values())
    print ( final_result)
    return final_result

@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
@csrf_exempt
def get_overall_graph(request):
    owed_to_user = get_owed_to_user(request)
    user_ows = get_user_ows(request)

    for record in owed_to_user:
        record['amount'] = abs(record['amount'])

    for record in user_ows:
        record['amount'] = -abs(record['amount'])
    print(user_ows)
    combined_result = {}
    for record in owed_to_user + user_ows:
        key = record['name']
        if key in combined_result:
            combined_result[key]['amount'] += record['amount']
        else:
            combined_result[key] = record
    
    serialized_result = CombinedResultSerializer(combined_result.items(), many=True).data
    return JsonResponse(serialized_result, safe=False)
