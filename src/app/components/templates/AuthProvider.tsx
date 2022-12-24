import { useEffect, useState } from 'react'
import auth from '@app/libs/auth'
import routes from '@app/libs/routes'

type Props = {
  children: React.ReactNode
}

const AuthProvider = ({ children }: Props) => {
  const token = auth.getToken()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    async function authenticate() {
      if (!token && window.location.pathname !== routes.auth) {
        auth.redirectToLogin()

        return
      }

      if (token) {
        await auth.refreshToken(token)
      }

      setIsAuthenticated(true)
    }

    authenticate()
  }, [])

  return (
    <>
      {isAuthenticated && children}
      {!isAuthenticated && <span />}
    </>
  )
}

export default AuthProvider
