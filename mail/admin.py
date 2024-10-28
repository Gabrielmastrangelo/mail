from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(Email)  # Register the model
admin.site.register(User)  # Register the model

