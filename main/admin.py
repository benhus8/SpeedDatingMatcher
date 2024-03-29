from django.contrib import admin
from .models import Person

# Register your models here.
@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ('number', 'first_name', 'email')
    search_fields = ('number', 'first_name', 'email')
    list_per_page = 10