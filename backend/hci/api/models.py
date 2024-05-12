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
    name = models.CharField(max_length=100) 
    # collection of users in the group (for now its in text field, later maybe change to more apropriate field type). I use User in '' 
    # since python doesnt have forward declaration and  i cant point to User class declared below lol 
    users = models.ManyToManyField('User')  
    # the amount of money that users needed to share 
    amount = models.PositiveIntegerField(blank=True, null=True)
    # date and time when the group was created 
    created = models.DateField(timezone.now(), default='1111-11-11')
    # debts of each user 
    debts = models.ForeignKey('Debt', default=None, null = True, blank = True, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    # a unique username 
    username = models.CharField(max_length=20, unique=True)
    # email 
    email = models.EmailField()
    # a boolean value debt indicating whether user has unpaid debt in any of groups he is in or not
    debt = models.BooleanField(default=False)
    # groups that user is in. on_delete param maybe should be diff idk for now
    groups = models.TextField(null=True, blank=True , default=None, )
    # user profile photo 
    profilePicture = models.ImageField(upload_to ='uploads/', default=None, null=True)
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
    # debts of each user 
    debts = models.TextField()
    def __str__(self):
        return self.debts
# to migrate:
    # 1. add app to settings settings.py
    # 2. use python manage.py makemigrations   
    # 3. use python manage.py migrate to add table
    # 4. to add to admin panel, add to admin.py 