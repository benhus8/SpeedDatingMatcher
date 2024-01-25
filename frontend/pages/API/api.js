export async function getData() {
  const res = await fetch(' http://127.0.0.1:8000/api/persons/contacts/')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}

export const deleteRecord = async (personRequestingContactId, preferredPersonId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/api/delete-contact-requests/${personRequestingContactId}/${preferredPersonId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Nie udało się usunąć rekordu.');
    }

    return response.json();
  } catch (error) {
    console.error('Błąd podczas usuwania rekordu:', error);
    throw error;
  }
};
