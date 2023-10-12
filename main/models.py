from django.db import models

class Person(models.Model):
    number = models.IntegerField(primary_key=True)
    first_name = models.CharField(max_length=200)
    email = models.EmailField()
class ContactRequest(models.Model):
    person_requesting_contact = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='person_req_contact')
    preferred_person = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='preferred_person')
