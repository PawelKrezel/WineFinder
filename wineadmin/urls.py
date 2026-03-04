from django.urls import path
from . import views

urlpatterns = [
    path('', views.workInProgress, name='workInProgress'),
    path('admin/', views.wineadmin, name='wineadmin'),
    path('add-new-wine/', views.add_new_wine, name='add_new_wine'),
]