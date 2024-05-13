from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.utils import timezone
from django.utils.translation import gettext_lazy as _
from .managers import CustomUserManager
# Create your models here.


# model of Group - collection of users that want to share expenses (idk how it should be, its for learning purposes)
class Group(models.Model): 
    # name of the group 
    name = models.CharField(max_length=100, unique=True) 
    # collection of users in the group (for now its in text field, later maybe change to more apropriate field type). I use User in '' 
    # since python doesnt have forward declaration and  i cant point to User class declared below lol 
    users = models.ManyToManyField('User')  
    # the amount of money that users needed to share 
    amount = models.PositiveIntegerField(blank=True, null=True)
    # date and time when the group was created 
    created = models.DateField(default=timezone.now())
    # debts of each user 
    debts = models.ManyToManyField('Debt', blank=True)

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    # a unique username 
    username = models.CharField(max_length=20, unique=True)
    # email 
    email = models.EmailField()
    # a boolean value debt indicating whether user has unpaid debt in any of groups he is in or not
    owns = models.BooleanField(default=False)
    # groups that user is in. on_delete param maybe should be diff idk for now
    groups = models.ManyToManyField(Group)
    # user profile photo 
    profilePicture = models.ImageField(upload_to ='uploads/', default=None, null=True, blank=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = []
    objects = CustomUserManager()

    def __str__(self):
        return self.username


# model of Group - collection of users that want to share expenses (idk how it should be, its for learning purposes)
class Debt(models.Model): 

    user_owner = models.ForeignKey(User,default=1, null=True, on_delete=models.CASCADE, choices=[])
    

    # debts of each user 
    debts_amounts = models.TextField()
    def __str__(self):
        return self.debts_amounts
    
    @property
    def get_group(self): 
        return self.Group.all()

    @property
    def users_choices(self): 
        group = self.get_group()
        print(group, 'asdasdasdad')
        return list(group.users)
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
       

    def _update_user_choices(self):
        if self.pk:  # Check if the instance has been saved to the database
            # Get the users related to this Debt instance
            print(self.group_set.all(), "--------------------------------------------------------------------------------")
            users = self.group_set.all().first().users.all()
            print(users, "asdasd")
            #users = group.users
            # Construct choices based on the related users
            # self.user_owner.choices = [(a, a) for a in users]
            print(self.user_owner)
            self._meta.get_field('user_owner').choices = users
        else:
            # If the instance hasn't been saved yet, set choices to an empty list
            self._meta.get_field('user_owner').choices = []
    
# to migrate:
    # 1. add app to settings settings.py
    # 2. use python manage.py makemigrations   
    # 3. use python manage.py migrate to add table
    # 4. to add to admin panel, add to admin.py 