from django.urls import path
from . import views

urlpatterns = [
    path('wineadmin/', views.wineadmin, name='wineadmin'),
]