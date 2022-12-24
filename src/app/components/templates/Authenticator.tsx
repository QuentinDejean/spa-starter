import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import auth from '@app/libs/auth'
import routes from '@app/libs/routes'

const Authenticator = () => {
  const navigate = useNavigate()

  useEffect(() => {
    async function authenticate() {
      const token = auth.getToken()
      if (token) {
        navigate(routes.home)
        return
      }

      const code = new URLSearchParams(window.location.search).get('code')

      if (!code) {
        auth.redirectToLogin()
        return
      }

      await auth.authenticate(code)

      navigate(routes.home)
    }

    authenticate()
  }, [])

  return null
}

export default Authenticator
