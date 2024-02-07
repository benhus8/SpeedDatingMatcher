const defaultPath = 'http://127.0.0.1:8000'
export async function getAllPersonsWithContactRequests() {
  const res = await fetch(defaultPath + '/api/persons/contacts/')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export const deleteContactRequest = async (personRequestingContactId, preferredPersonId) => {
  try {
    const response = await fetch(defaultPath + `/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export const deletePerson = async (personNumber) => {
  try {
    await fetch(defaultPath + `/api/persons/${personNumber}/delete/`, {
      method: 'DELETE',
    });
  } catch (error) {
    console.error(error);
  }
};

export const createPerson = async (data) => {
  try {
    const response = await fetch(defaultPath + `/api/persons`, {
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
    const response = await fetch(defaultPath + `/api/persons/${personNumber}/`, {
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