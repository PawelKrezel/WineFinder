from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('', views.workInProgress, name='workInProgress'),
    path('admin/', views.wineadmin, name='wineadmin'),
    path('add-new-wine/', views.add_new_wine, name='add_new_wine'),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path('update-wines/', views.update_wines, name='update_wines'),
    path('allocate-wine-slots/', views.allocate_wine_slots, name='allocate_wine_slots'),
    path('import-wines/', views.import_wines, name='import_wines'),
    path('search/', views.search, name='search'),
    path('wine/<uuid:wine_id>/', views.wine_detail, name='wine_detail'),
    path('export-wines/', views.export_wines, name='export_wines'),
]