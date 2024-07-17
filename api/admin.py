from django.contrib import admin
from .models import Group, User
# Register your models here.


# we substitute the code below with customized way to display Groups on admin panel
# admin.site.register(Group)
@admin.register(Group)
class GroupModel(admin.ModelAdmin):
    # ways of filtering 
    list_filter = ('name', 'users')
    # what displays on admin panel
    list_display = ('id', 'name')

@admin.register(User)
class UserModel(admin.ModelAdmin):
    list_filter = ('username','owns', 'groups')
    list_display = ('id', 'username')