from rest_framework import generics
from .models import  ContactRequest
from rest_framework.response import Response
from rest_framework import status
from .models import Person
from .serializers import PersonCreateSerializer, PersonUpdateSerializer, ContactRequestCreateSerializer


class PersonCreateView(generics.ListCreateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonCreateSerializer

class PersonUpdateView(generics.UpdateAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonUpdateSerializer

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