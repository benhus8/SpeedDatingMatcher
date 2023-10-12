from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Person, ContactRequest
import json
from django.db import transaction


# Create your views here.
@csrf_exempt
def persons(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        first_name = data.get('first_name')
        email = data.get('email')
        number = data.get('number')

        if first_name and email and number:
            person = Person(first_name=first_name, email=email, number=number)

            if Person.objects.filter(number=number).exists():
                return JsonResponse({'error': 'Person with this number already exists'}, status=400)
            person.save()
            return JsonResponse({'message': 'Person created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'ALl fields are required.'}, status=400)

    if request.method == 'GET':
        persons = Person.objects.all()
        person_list = [{'first_name': person.first_name, 'email': person.email, 'number': person.number} for
                       person in persons]
        return JsonResponse({'data': person_list}, safe=False)

    return JsonResponse({'error': 'HTTP method not allowed'}, status=405)


@csrf_exempt
@transaction.atomic
def contact_request(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        requesting_person_number = data.get('requesting_person_number')
        preferred_person_number = data.get('preferred_person_number')

        if requesting_person_number and preferred_person_number:
            if not Person.objects.filter(number=requesting_person_number).exists():
                return JsonResponse(
                    {'error': f'Person requesting contact with number {requesting_person_number} does not exist'},
                    status=400)

            if not Person.objects.filter(number=preferred_person_number).exists():
                return JsonResponse(
                    {'error': f'Preferred person with number {preferred_person_number} does not exist'}, status=400)

            requesting_person = Person.objects.get(number=requesting_person_number)
            preferred_person = Person.objects.get(number=preferred_person_number)

            if not (check_if_can_add_contact_request(requesting_person, preferred_person)):
                return JsonResponse(
                    {'error': f'This contact request already exists!'}, status=409)

            new_contact_request = ContactRequest(person_requesting_contact=requesting_person,
                                                 preferred_person=preferred_person)
            new_contact_request.save()

            return JsonResponse({'message': 'Contact request created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'ALl fields are required.'}, status=400)

    if request.method == 'GET':
        contact_requests = ContactRequest.objects.all()
        contact_request_list = []

        for contact_request_obj in contact_requests:
            contact_entry = {
                'person_requesting_contact': {
                    'name': contact_request_obj.person_requesting_contact.email,
                    'number': contact_request_obj.person_requesting_contact.number
                },
                'preferred_person': {
                    'name': contact_request_obj.preferred_person.email,
                    'number': contact_request_obj.preferred_person.number
                }
            }
            contact_request_list.append(contact_entry)
        return JsonResponse({'data': contact_request_list}, safe=False)

    return JsonResponse({'error': 'HTTP method not allowed'}, status=405)


def check_if_can_add_contact_request(requesting_person, preferred_person):
    if (ContactRequest.objects.filter(person_requesting_contact=requesting_person,
                                      preferred_person=preferred_person).exists()):
        return False
    return True
