from django.contrib import admin
from .models import Wine, Slot

# Register your models here.
admin.site.register(Slot)
admin.site.register(Wine)