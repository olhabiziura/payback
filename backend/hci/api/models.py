from django.db import models

# Create your models here.


# model of Group - collection of users that want to share expenses (idk how it should be, its for learning purposes)
class Group(models.Model): 
    # name of the group 
    name = models.CharField(max_length=100) 
    # collection of users in the group (for now its in text field, later maybe change to more apropriate field type)
    users = models.TextField()
    
    def __str__(self):
        return self.name

# model of User - a way User will be represented in DB, has username, ... , django creates autoincremented id automatically, 
class User(models.Model):
    # a unique username 
    username = models.CharField(max_length=20)
    # a boolean value debt indicating whether user has unpaid debt in any of groups he is in or not
    debt = models.BooleanField()
    # groups that user is in. on_delete param maybe should be diff idk for now
    groups = models.ForeignKey(Group, null=True, blank=True , on_delete=models.RESTRICT)

    def __str__(self):
        return self.username
# to migrate:
    # 1. add app to settings settings.py
    # 2. use python manage.py makemigrations   
    # 3. use python manage.py migrate to add table
    # 4. to add to admin panel, add to admin.py 