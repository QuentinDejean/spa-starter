import auth from '@app/libs/auth'

const httpClient = async <T>(url: string, fetchOptions: RequestInit = {}): Promise<T> => {
  const token = auth.getToken()

  if (!token) {
    throw new Error('An error occured: no authentication token was found')
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { access_token } = await auth.refreshToken(token)

  const options = { headers: { Authorization: `Bearer ${access_token}` }, ...fetchOptions }
  const response = await fetch(url, options)

  if (!response.ok) {
    const message = 'An error occurred while fetching the data.'
    const error = new Error(message)
    // Attach extra info to the error object.
    const info = await response.json()

    // eslint-disable-next-line no-console
    console.error(error, info)
    throw error
  }

  return response.json()
}

export default httpClient
