from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import api_wines, api_wine_detail

urlpatterns = [
    path('admin/', views.wineadmin, name='wineadmin'),
    path('add-new-wine/', views.add_new_wine, name='add_new_wine'),
    path('admin/table/', views.table_of_wines, name='table_of_wines'),
    path('admin/map/', views.cellar_map_editable, name='cellar_map_editable'),
    path('admin/new/', views.new_wine, name='new_wine'),
    path('admin/dbms/', views.dbms_tools, name='dbms_tools'),
    path("login/", auth_views.LoginView.as_view(), name="login"),
    path("logout/", auth_views.LogoutView.as_view(), name="logout"),
    path('update-wines/', views.update_wines, name='update_wines'),
    path('allocate-wine-slots/', views.allocate_wine_slots, name='allocate_wine_slots'),
    path('import-wines/', views.import_wines, name='import_wines'),
    path('', views.search, name='search'),
    path('search/', views.search, name='search'),
    path('wine/<uuid:wine_id>/', views.wine_detail, name='wine_detail'),
    path('export-wines/', views.export_wines, name='export_wines'),
    path('api/wines/', api_wines, name='api_wines'),
    path('api/wines/<uuid:wine_id>/', api_wine_detail, name='api_wine_detail'),
]