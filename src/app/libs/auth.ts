import routes from './routes'

export type Token = {
  access_token: string
  access_token_expiry?: number
  expires_in: number
  refresh_token: string
}

const STORAGE_NAMESPACE = 'some-namespace'
const STORAGE_CODE_VERIFIER = `${STORAGE_NAMESPACE}:code_verifier`
const STORAGE_STATE = `${STORAGE_NAMESPACE}:state`
const STORAGE_TOKEN = `${STORAGE_NAMESPACE}:token`

const oauthLoginUrl = ''

const Authenticator = () => {
  const tokenString = localStorage.getItem(STORAGE_TOKEN)
  let token = tokenString ? (JSON.parse(tokenString) as Token) : null

  const getToken = (): Token | null => token

  const setToken = (newToken: Token): void => {
    token = newToken
  }

  const deleteToken = (): void => {
    token = null
    localStorage.removeItem(STORAGE_TOKEN)
  }

  const sha256 = async (str: string) => crypto.subtle.digest('SHA-256', new TextEncoder().encode(str))

  const base64URLEncode = (str: ArrayBufferLike) =>
    btoa(String.fromCharCode.apply(null, new Uint8Array(str) as unknown as number[]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

  const generateNonce = async () => {
    const hash = await sha256(crypto.getRandomValues(new Uint32Array(4)).toString())
    // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    const hashArray = Array.from(new Uint8Array(hash))
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  }

  const redirectToLogin = async () => {
    const state = await generateNonce()
    const codeVerifier = await generateNonce()

    sessionStorage.setItem(STORAGE_STATE, state)
    sessionStorage.setItem(`${STORAGE_CODE_VERIFIER}:${state}`, codeVerifier)
    const codeChallenge = base64URLEncode(await sha256(codeVerifier))

    const params = new URLSearchParams({
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      redirect_uri: `${window.location.origin}${routes.auth}`,
      response_type: 'code',
    })

    window.location.replace(`${oauthLoginUrl}/login?${params.toString()}`)
  }

  const getTokenExpiry = (accessToken: string): number => {
    const [, payload] = accessToken.split('.')
    const decodedPayload = JSON.parse(atob(payload))

    return decodedPayload.exp
  }

  const oauthClient = async (endpoint: string, payload: { [key: string]: string }) => {
    const response = await fetch(`${oauthLoginUrl}/oauth2/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        redirect_uri: `${window.location.origin}${routes.auth}`,
        ...payload,
      }),
    })

    if (!response.ok) {
      throw new Error(await response.json())
    }

    return (await response.json()) as Token
  }

  const persistTokenWithExpiry = (tkn: Token): void => {
    const expiry = getTokenExpiry(tkn.access_token)

    const tokenWithExpiry = { ...tkn, access_token_expiry: expiry }

    localStorage.setItem(STORAGE_TOKEN, JSON.stringify({ ...tkn, access_token_expiry: expiry }))

    setToken(tokenWithExpiry)
  }

  const authenticate = async (code: string): Promise<Token> => {
    const state = sessionStorage.getItem(STORAGE_STATE)
    const codeVerifier = sessionStorage.getItem(`${STORAGE_CODE_VERIFIER}:${state}`)
    if (!codeVerifier) {
      throw new Error('Invalid state')
    }

    sessionStorage.removeItem(STORAGE_STATE)
    sessionStorage.removeItem(`${STORAGE_CODE_VERIFIER}:${state}`)

    const updatedToken = await oauthClient('token', {
      code_verifier: codeVerifier,
      code,
      grant_type: 'authorization_code',
    })

    persistTokenWithExpiry(updatedToken)

    return updatedToken
  }

  const hasTokenExpired = (tkn: Token): boolean => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { access_token_expiry } = tkn

    if (access_token_expiry) {
      return access_token_expiry < Date.now() / 1000
    }

    return true
  }

  const refreshToken = async (tkn: Token): Promise<Token> => {
    if (!hasTokenExpired(tkn)) {
      return tkn
    }

    try {
      const refreshedToken = await oauthClient('token', {
        grant_type: 'refresh_token',
        refresh_token: tkn.refresh_token,
      })

      persistTokenWithExpiry(refreshedToken)

      return refreshedToken
    } catch (err) {
      deleteToken()
      redirectToLogin()

      return tkn
    }
  }

  const revokeToken = async (): Promise<void> => {
    try {
      if (token?.refresh_token) {
        await oauthClient('revoke', {
          grant_type: 'refresh_token',
          refresh_token: token.refresh_token,
        })
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('There was an error revoking the token', err)
    } finally {
      deleteToken()
      redirectToLogin()
    }
  }

  return {
    authenticate,
    getToken,
    redirectToLogin,
    refreshToken,
    revokeToken,
  }
}

const auth = Authenticator()

export default auth
