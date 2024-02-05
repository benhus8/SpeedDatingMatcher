export async function getAllPersonsWithContactRequests() {
  const res = await fetch(' http://127.0.0.1:8000/api/persons/contacts/')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getAllPersonsWithContactRequests()

  return <main></main>
}

export const deleteContactRequest = async (personRequestingContactId, preferredPersonId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}`, {
      method: 'DELETE',
    });
    return response.json();
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

export const createContactRequest = async (data) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/contact-requests`, {
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

export const getContactRequest = async () => {
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

    const responseData = await response.json();

    return responseData;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
