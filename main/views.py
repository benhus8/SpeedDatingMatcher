from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Person
# Create your views here.
@csrf_exempt  # Tymczasowo wyłączamy CSRF dla tego przykładu, pamiętaj o zabezpieczeniach w prawdziwym projekcie
def create_person(request):
    if request.method == 'POST':
        first_name = request.POST.get('first_name')
        last_name = request.POST.get('last_name')
        email = request.POST.get('email')

        if first_name and last_name and email:
            person = Person(first_name=first_name, last_name=last_name, email=email)
            person.save()
            return JsonResponse({'message': 'Osoba została dodana.'})
        else:
            return JsonResponse({'error': 'Wszystkie pola są wymagane.'}, status=400)

    return JsonResponse({'error': 'Metoda HTTP nie jest obsługiwana.'}, status=405)