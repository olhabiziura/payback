from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import Index, RegisterView, protected_view, user_groups, create_group, delete_groups, update_profile, get_profile_data, get_group_details, update_group_members, create_expense, get_profile, get_expense_details, search_users, add_friend, get_friends_list, get_overall_graph, get_user_ows_serialised, process_payment_and_payout

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', Index, name='index'),  # This should be a separate URL pattern, not nested under 'api/'
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/protected/', protected_view, name='protected'),
    path('user-groups/', user_groups, name='user_groups'),
    path('api/addgroup/', create_group, name='create_group'),
    path('delete-groups/',delete_groups, name = 'delete_groups'),
    path('api/update-profile/',update_profile, name = 'profile_picture'),
    path('api/user-profile/<int:user_id>/',get_profile_data, name = 'profile'),
    path('api/users/me/', get_profile, name = 'user_profile'),
    path('api/groups/<int:group_id>/', get_group_details, name='group-details'),
    path('api/groups/<int:group_id>/members/', update_group_members, name='update-group-members'),
    path('api/groups/<int:group_id>/addExpense/', create_expense, name='add-expense'),
    path('api/expenses/<int:expense_id>/', get_expense_details, name='add-expense'),
    path('api/search-users/', search_users, name='search_users'),
    path('api/add-friend/', add_friend, name='add_friend'),
    path('api/friends/', get_friends_list, name='get_friends_list'),
    path('api/graph-data/', get_overall_graph, name='get_graph'),
    path('api/user-owes/', get_user_ows_serialised, name='get_owes'),


    path('process-payment-and-payout/', process_payment_and_payout, name='create_payment_intent'),


]

