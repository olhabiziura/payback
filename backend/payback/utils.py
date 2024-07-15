import threading
import time
from .models import UserGroup, User, Group, UserProfile, Membership, Owes, Expense
import datetime , requests
from datetime import timedelta
from django.utils import timezone
from .serializers import RegisterSerializer, UserProfileSerializer, ExpenseSerializer, ExpenseDataSerializer, OwesSerializer, CombinedResultSerializer, CombinedResultSerializer2
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
def check_variables():
    while True:
        time.sleep(1000000)
        
        # Your logic to check variables
        another()
def another(): 
        expenses = Expense.objects.all()
        for expense in expenses: 
            owes = Owes.objects.filter(expense=expense)
    
            for owe in owes:
                member = owe.member
                membership = Membership.objects.filter(id=owe.member_id).first()
                time_diff = timezone.now() - owe.date
                time_debt = 10
                
                
               
                expense = get_object_or_404(Expense, id=owe.expense_id)
                owed_to_user = get_object_or_404(User, id=expense.user_id)

                expense_data = ExpenseSerializer(expense).data
        
        # Add 'paidBy' field to expense_data
            
                
                if member.name == owed_to_user.username: 
                    continue
                
               
                if time_diff > timedelta(seconds=time_debt) : 
                    url = "https://app.nativenotify.com/api/indie/notification"
                    obj  =       {
                        'subID': member.name ,
                        'appId': 22472,
                        'appToken': 'WZOyPqf6yGb8GudffQu8ZH',
                        'title': f"Hello {member.name} you owe {owe.amount} to: {owed_to_user.username}",
                        'message': f"Its been {time_debt} seconds since you owe, pls pay asap",
                        'dateSent': timezone.now().isoformat(),
                       
                    }
                    owe.date = timezone.now().isoformat()
                    # Prepare the headers
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    # Send the POST request
                    response = requests.post(url, json=obj, headers=headers)

                    # Print the response status code and body
                    print(response.status_code)
                    print(response.content)
          
                    time.sleep(100000000)
       
        time.sleep(10000000)  # Adjust the s

def start_background_task():
    thread = threading.Thread(target=check_variables)
    thread.daemon = True
    thread.start()
