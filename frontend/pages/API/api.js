
export const getContactRequests = async () => {
    try {
        const response = await fetch(' http://127.0.0.1:8000/api/contact-requests')
        const result = await response.json()
        return result
    } catch (error) {
        console.error('Błąd pobierania danych: ', error)
        throw error
    }
}
async function getData() {
  const res = await fetch(' http://127.0.0.1:8000/api/contact-requests')

  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }

  return res.json()
}

export default async function Page() {
  const data = await getData()

  return <main></main>
}