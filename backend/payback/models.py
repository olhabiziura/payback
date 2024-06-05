from django.db import models
from django.contrib.auth.models import User



class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    iban = models.CharField(max_length=34, null=True, blank=True)

    def __str__(self):
        return self.user.username
    
class Group(models.Model):
    name = models.CharField(max_length=100)
    members = models.ManyToManyField(User, through='Membership')



class Friends(models.Model):
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='friends_as_user2')

    class Meta:
        unique_together = [['user1', 'user2']]

    def save(self, *args, **kwargs):
        # Ensure user1 is always less than user2 to maintain uniqueness
        if self.user1_id > self.user2_id:
            self.user1, self.user2 = self.user2, self.user1
        super().save(*args, **kwargs)


class Membership(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)

    def save(self, *args, **kwargs):
        if self.user:
            self.name = self.user.username  # Automatically fill name with user.username if user is provided
        elif not self.name:
            raise ValueError("Either user or name must be provided")
        super().save(*args, **kwargs)


class UserGroup(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)

    class Meta:
        unique_together = ('user', 'group')

class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expenses')
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='expenses')
    name = models.CharField(max_length=255)
    amount = models.DecimalField(max_digits=10, decimal_places=2)

class Owes(models.Model):
    expense = models.ForeignKey(Expense, on_delete=models.CASCADE)
    member = models.ForeignKey(Membership, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Owes: {self.expense} - {self.member}"
    