import threading
import time
from .models import UserGroup, User, Group, UserProfile, Membership, Owes, Expense
import requests
from datetime import timedelta
from django.utils import timezone
from .serializers import RegisterSerializer, UserProfileSerializer, ExpenseSerializer, ExpenseDataSerializer, OwesSerializer, CombinedResultSerializer, CombinedResultSerializer2
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from datetime import datetime
import pytz

def check_variables():
    while True:
        time.sleep(40)
        
        # Your logic to check variables
        another()
def another(): 
        expenses = Expense.objects.all()
        for expense in expenses: 
            owes = Owes.objects.filter(expense=expense)
    
            for owe in owes:
                member = owe.member
                membership = Membership.objects.filter(id=owe.member_id).first()
                time_diff = timezone.now() - owe.last_notification_date
                time_debt = 40
                
                
               
                expense = get_object_or_404(Expense, id=owe.expense_id)
                owed_to_user = get_object_or_404(User, id=expense.user_id)

                expense_data = ExpenseSerializer(expense).data
                # Convert the ISO format date string to a datetime object
                date = datetime.fromisoformat(str(owe.date))

                # Get the current date and time in UTC
                now = datetime.now(pytz.utc)
                # Calculate the difference between now and the given date
                difference = now - date

                # Extract the number of days from the difference
                days_passed = difference.days
        # Add 'paidBy' field to expense_data
            
                
                if member.name == owed_to_user.username: 
                    continue
                
               
                if time_diff > timedelta(seconds=time_debt) : 
                    url = "https://app.nativenotify.com/api/indie/notification"
                    obj  =       {
                        'subID': member.name ,
                        'appId': 22505,
                        'appToken': '8ycZITuSYpxybSMqD8gWSb',
                        'title': f"Hello {member.name}! You owe {owe.amount} to: {owed_to_user.username}",
                        'message': f"Its been {days_passed} days since user {owed_to_user.username} paid for {expense.name}",
                        'dateSent': timezone.now().isoformat(),
                       
                    }
                    owe.last_notification_date = timezone.now().isoformat()
                    # Prepare the headers
                    headers = {
                        'Content-Type': 'application/json'
                    }
                    # Send the POST request
                    response = requests.post(url, json=obj, headers=headers)

                    # Print the response status code and body
                    print(response.status_code)
                    print(response.content)
          
                    time.sleep(10)
       
        time.sleep(40)  # Adjust the s

def start_background_task():
    thread = threading.Thread(target=check_variables)
    thread.daemon = True
    thread.start()
