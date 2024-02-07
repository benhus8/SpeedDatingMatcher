export async function getAllPersonsWithContactRequests() {
  const res = await fetch(' http://127.0.0.1:8000/api/persons/contacts/')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export const deleteContactRequest = async (personRequestingContactId, preferredPersonId) => {
  try {
      await fetch(`http://127.0.0.1:8000/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}/`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

export const deletePerson = async (personNumber) => {
  try {
    await fetch(`http://127.0.0.1:8000/api/persons/${personNumber}/delete/`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

export const createPerson = async (data) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/persons`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export const editPerson = async (data, personNumber) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/persons/${personNumber}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createContactRequest = async (requestData, personRequestingContactId) => {
  const response = await fetch(`http://127.0.0.1:8000/api/contact-requests/${personRequestingContactId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Pomyślnie utworzono żądanie kontaktu:', data);
  } else {
    throw new Error('Wystąpił błąd podczas tworzenia żądania kontaktu');
  }
};

export const getPersonsContactRequest = async () => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/contact-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getContactRequests = async (personNumber) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/persons/${personNumber}/possible-contacts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
