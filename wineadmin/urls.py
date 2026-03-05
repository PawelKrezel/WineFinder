from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.workInProgress, name='workInProgress'),
    path('admin/', views.wineadmin, name='wineadmin'),
    path('add-new-wine/', views.add_new_wine, name='add_new_wine'),
    path("login/", auth_views.LoginView.as_view(), name="login"),
]