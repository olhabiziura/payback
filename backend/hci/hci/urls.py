"""
URL configuration for hci project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from django.urls import include, path, re_path
from api.views import  GroupList, UserList, GroupDetail, DebtDetail, UserDetailViewSet, Login, Signup, test_token  , DebtList
from  rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register('users', UserDetailViewSet, basename='users')



urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    path('groups/', GroupList.as_view() ),
    path('users/', UserList.as_view()),
    path('groups/<int:id>/', GroupDetail.as_view()),
    path('groups/<int:group_id>/', DebtList.as_view()),
    path('groups/<int:group_id>/debt/<int:debt_id>', DebtDetail.as_view()),
    re_path('login', Login.as_view()) ,
    re_path('signup',Signup.as_view()),
    re_path('test_token',test_token)
]
