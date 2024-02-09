const defaultPath = 'http://127.0.0.1:8000'

const ApiPage = () => {
  return (
    <div>
      <h1>API Page</h1>
    </div>
  );
};
export default ApiPage;
export async function getAllPersonsWithContactRequests(setIsLoggedIn) {
  try {
    const res = await fetch(defaultPath +'/api/persons/contacts/', {
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
    await fetch(defaultPath + `/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}`, {
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
    await fetch(defaultPath + `/api/persons/${personNumber}/delete/`, {
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
    const response = await fetch(defaultPath + `/api/persons`, {
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
    const response = await fetch(defaultPath + `/api/persons/${personNumber}/`, {
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

export const createContactRequest = async (requestData, personRequestingContactId) => {
  const response = await fetch(defaultPath + `/api/contact-requests/${personRequestingContactId}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': window.sessionStorage.getItem("access_token")
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
    const response = await fetch(defaultPath + `/api/contact-requests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem("access_token")
      },
    });
    return response.json();
  } catch (error) {
    console.error(error);
  }
};

export const getContactRequests = async (personNumber) => {
  try {
    const response = await fetch(defaultPath + `/api/persons/${personNumber}/possible-contacts/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': window.sessionStorage.getItem("access_token")
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getToken = async (data) => {
  try {
    return await fetch(defaultPath + `/api/token/`, {
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
}

export const sendEmails = async () => {
  try {
    return await fetch(defaultPath + `/api/send-emails/`, {
      method: 'GET',
      headers: {
        'Authorization': window.sessionStorage.getItem("access_token")
      },
    })
  } catch (error) {
    console.error(error);
  }
}