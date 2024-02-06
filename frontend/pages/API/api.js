
export async function getAllPersonsWithContactRequests(setIsLoggedIn) {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/persons/contacts/', {
      method: 'GET',
      headers: {
        'Authorization': window.sessionStorage.getItem("access_token")
      }
    });

    if(res.status === 401) {
      setIsLoggedIn(false)
      return null
    } else {
      return res.json();
    }

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteContactRequest = async (personRequestingContactId, preferredPersonId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': window.sessionStorage.getItem("access_token")
      }
    });
  } catch (error) {
    console.error(error);
  }
};

export const deletePerson = async (personNumber) => {
  try {
    await fetch(`http://127.0.0.1:8000/api/persons/${personNumber}/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': window.sessionStorage.getItem("access_token")
      }
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
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem("access_token")
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
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem("access_token")
      },
      body: JSON.stringify(data),
    });
    return response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getToken = async (data) => {
  try {
    return await fetch(`http://127.0.0.1:8000/api/token/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem("access_token")
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    console.error(error);
  }
};