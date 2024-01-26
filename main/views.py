import smtplib
from email.message import EmailMessage
from django.http import JsonResponse
from rest_framework import generics
from django.conf import settings
from bs4 import BeautifulSoup
from YouveGotMail import settings
from .models import  Person, ContactRequest
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, ContactRequestCreateSerializer, PersonWithPreferredPersonsSerializer, ContactRequestDeleteSerializer
from django.http import HttpResponse


H1_TAG_STYLE = """Margin:0;line-height:22px;mso-line-height-rule:exactly;font-family:'trebuchet ms', 'lucida grande', 'lucida sans unicode', 'lucida sans', tahoma, sans-serif;font-size:18px;font-style:normal;font-weight:bold;color:#FE4642"""
LI_TAG_STYLE = """-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:arial, 'helvetica neue', helvetica, sans-serif;line-height:27px;Margin-bottom:15px;margin-left:0;color:#FE4642;font-size:14px;padding-left:7px'"""
class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer


class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer


class ContactRequestDeleteView(generics.DestroyAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestDeleteSerializer
    def delete(self, request, *args, **kwargs):
        person_requesting_contact_id = self.kwargs.get('person_requesting_contact_id')
        preferred_person_id = self.kwargs.get('preferred_person_id')

        contact_request = get_object_or_404(ContactRequest,
                                           person_requesting_contact_id=person_requesting_contact_id,
                                           preferred_person_id=preferred_person_id)

        contact_request.delete()

        return JsonResponse({'message': 'Contact request deleted successfully'})


class PersonListAPIView(generics.ListAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonWithPreferredPersonsSerializer

class ContactRequestCreateView(generics.ListCreateAPIView):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestCreateSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)

        return Response(serializer.data, status=status.HTTP_201_CREATED)

class PersonDeleteView(generics.DestroyAPIView):
    queryset = Person.objects.all()

def send_email(request):
    server = initialize_server_connection()

    with open("templates/index.html", encoding='utf8') as file:
        html_template = file.read()

    matching_dict = findMatchingsForAllPersons()

    for key in matching_dict.keys():
        soup = BeautifulSoup(html_template, 'html.parser')
        ul_tag = soup.find('ul', {'id': 'name-list'})

        msg = EmailMessage()
        msg["Subject"] = "Wyniki Speed Dating! dla numeru" + key.number
        msg["From"] = settings.EMAIL_HOST_USER
        msg["To"] = key.email

        if (len(matching_dict[key]) == 0):
            continue

        for person in matching_dict[key]:
            h1_tag = soup.new_tag('h1')
            h1_tag['style'] = H1_TAG_STYLE
            new_li_tag = soup.new_tag('li')
            new_li_tag['style'] = LI_TAG_STYLE
            h1_tag.string = 'Numerek: ' + str(person.number) +', Email: ' + str(person.email)
            new_li_tag.append(h1_tag)
            ul_tag.append(new_li_tag)

        msg.add_alternative(soup.prettify(), subtype='html')
        server.send_message(msg)

    server.quit()
    return HttpResponse('Send Success!')

def findMatchingsForAllPersons():
    persons = Person.objects.all()
    matching_dict = {}
    for person in persons:
        matching_dict.setdefault(person, [])

        requests_from = ContactRequest.objects.filter(person_requesting_contact=person)

        for request in requests_from:
            reverse_request = ContactRequest.objects.filter(
                person_requesting_contact=request.preferred_person,
                preferred_person=person
            ).first()

            if reverse_request:
                matching_dict[person].append(request.preferred_person)

    return matching_dict


def initialize_server_connection():
    email_host = settings.EMAIL_HOST
    email_port = settings.EMAIL_PORT
    email_user = settings.EMAIL_HOST_USER
    email_password = settings.EMAIL_HOST_PASSWORD
    server = smtplib.SMTP(email_host, email_port)
    server.connect(email_host, email_port)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(email_user, email_password)
    return server
def fill_template_with_matching_persons():
    pass
