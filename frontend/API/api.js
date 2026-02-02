import { request } from '../lib/apiClient';
export async function getAllPersonsWithContactRequests(setIsLoggedIn) {
  try {
    const data = await request('/api/persons/contacts/', {
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') },
      onUnauthorized: () => setIsLoggedIn(false)
    });
    return data;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const deleteContactRequest = async (personRequestingContactId, preferredPersonId) => {
  try {
    await request(`/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}/`, {
      method: 'DELETE',
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deletePerson = async (personNumber) => {
  try {
    await request(`/api/persons/${personNumber}/delete/`, {
      method: 'DELETE',
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createPerson = async (data) => {
  try {
    return await request(`/api/persons/`, {
      method: 'POST',
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') },
      body: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const editPerson = async (data, personNumber) => {
  try {
    return await request(`/api/persons/${personNumber}/`, {
      method: 'PUT',
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') },
      body: data,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createContactRequest = async (requestData, personRequestingContactId) => {
  try {
    await request(`/api/contact-requests/${personRequestingContactId}/`, {
      method: 'POST',
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') },
      body: requestData,
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getPersonsContactRequest = async () => {
  try {
    return await request(`/api/contact-requests/`, {
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getContactRequests = async (personNumber) => {
  try {
    return await request(`/api/persons/${personNumber}/possible-contacts/`, {
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') }
    });
  } catch (error) {
    console.error(error);
    throw error;
  }
};


export const getToken = async (data) => {
  try {
    return await request(`/api/token/`, {
      method: 'POST',
      body: data,
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export const sendEmails = async () => {
  try {
    return await request(`/api/send-emails/`, {
      headers: { 'Authorization': window.sessionStorage.getItem('access_token') }
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}