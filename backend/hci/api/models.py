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
    debt_counter = models.TextField()
    rem_counter = models.TextField()

    def __str__(self):
        return self.name


class User(AbstractBaseUser, PermissionsMixin):
    # a unique username 
    username = models.CharField(max_length=20, unique=True)
    # email of a user 
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
    # the user that paid for stuff and other users own money to
    user_owner = models.ForeignKey(User,default=1, null=True, on_delete=models.CASCADE, related_name='user_owner')
    # collection of users from corresponding Group that now own money to owner.  Its separate entity since some users from Group may
    # not take part in debt
    debt_participants = models.ManyToManyField(User)
    # debts of each user 
    debts_amounts = models.TextField() 
    def __str__(self):
        return self.debts_amounts
    # fucntion to check if user owner is in debt_participants
    def check_owner(self):
        if self.user_owner in self.debt_participants.all():
            return True
        return False 
    def delete_self(self):
        # Perform any additional cleanup or operations before deletion
        self.delete()
    # fucntion to check if all debt_participants are from realted to this debt group
    def check_participants(self): 
        for i in self.debt_participants.all():
            if i not in self.group_set.first().users.all():
                return False
        return True
    @classmethod
    def exists(cls, **kwargs):
        """
        Custom method to check if an instance of the model exists based on certain criteria.
        Example usage: YourModel.exists(field1=value1, field2=value2)
        """
        return cls.objects.filter(**kwargs).exists()

    
# to migrate:
    # 1. add app to settings settings.py
    # 2. use python manage.py makemigrations   
    # 3. use python manage.py migrate to add table
    # 4. to add to admin panel, add to admin.py 