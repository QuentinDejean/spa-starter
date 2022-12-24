import { lazy, StrictMode, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import HelloWorld from '@app/components/atoms/HelloWorld'

import Layout from './components/templates/Layout'
// import AuthProvider from './components/templates/AuthProvider'
import routes from './libs/routes'

const Authenticator = lazy(() => import('./components/templates/Authenticator'))

const Home = () => (
  <StrictMode>
    <Suspense>
      <Layout>
        <HelloWorld />
      </Layout>
    </Suspense>
  </StrictMode>
)

const App = () => (
  // <AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route index path={routes.home} element={<Home />} />
      <Route path={routes.auth} element={<Authenticator />} />
      <Route path="*" element={<Home />} />
    </Routes>
  </BrowserRouter>
  // </AuthProvider>
)

export default App
