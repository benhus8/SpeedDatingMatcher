from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Person, ContactRequest
import json
from django.db import transaction


# Create your views here.
@csrf_exempt
def persons(request):
    if request.method == 'POST':
        _data = json.loads(request.body)
        _first_name = _data.get('first_name')
        _email = _data.get('email')
        _number = _data.get('number')

        if _first_name and _email and _number:
            _person = Person(first_name=_first_name, email=_email, number=_number)

            if Person.objects.filter(number=_number).exists():
                return JsonResponse({'error': 'Person with this number already exists'}, status=400)
            _person.save()
            return JsonResponse({'message': 'Person created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'ALl fields are required.'}, status=400)

    if request.method == 'GET':
        _persons = Person.objects.all()
        _person_list = [{'first_name': person.first_name, 'email': person.email, 'number': person.number} for
                        person in _persons]
        return JsonResponse({'data': _person_list}, safe=False)
    return JsonResponse({'error': 'HTTP method not allowed'}, status=405)


@csrf_exempt
@transaction.atomic
def contact_request(request):
    if request.method == 'POST':
        _data = json.loads(request.body)
        _requesting_person_number = _data.get('requesting_person_number')
        _preferred_person_number = _data.get('preferred_person_number')

        if _requesting_person_number and _preferred_person_number:
            if not Person.objects.filter(number=_requesting_person_number).exists():
                return JsonResponse(
                    {'error': f'Person requesting contact with number {_requesting_person_number} does not exist'},
                    status=400)

            if not Person.objects.filter(number=_preferred_person_number).exists():
                return JsonResponse(
                    {'error': f'Preferred person with number {_preferred_person_number} does not exist'}, status=400)

            _requesting_person = Person.objects.get(number=_requesting_person_number)
            _preferred_person = Person.objects.get(number=_preferred_person_number)

            if not (check_if_can_add_contact_request(_requesting_person, _preferred_person)):
                return JsonResponse(
                    {'error': f'This contact request already exists!'}, status=409)

            _new_contact_request = ContactRequest(person_requesting_contact=_requesting_person,
                                                  preferred_person=_preferred_person)
            _new_contact_request.save()

            return JsonResponse({'message': 'Contact request created successfully'}, status=201)
        else:
            return JsonResponse({'error': 'ALl fields are required.'}, status=400)

    if request.method == 'GET':
        _contact_requests = ContactRequest.objects.all()
        _contact_request_list = []

        for contact_request_obj in _contact_requests:
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
            _contact_request_list.append(contact_entry)
        return JsonResponse({'data': _contact_request_list}, safe=False)

    return JsonResponse({'error': 'HTTP method not allowed'}, status=405)


def check_if_can_add_contact_request(requesting_person, preferred_person):
    if (ContactRequest.objects.filter(person_requesting_contact=requesting_person,
                                      preferred_person=preferred_person).exists()):
        return False
    return True
