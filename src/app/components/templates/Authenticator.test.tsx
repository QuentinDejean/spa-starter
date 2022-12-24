import { fireEvent, render, screen, waitFor } from '@test/utils'

import AuthProvider from './AuthProvider'

const loggedInText = 'I am authenticated'

const setup = () => {
  const utils = render(<AuthProvider>{loggedInText}</AuthProvider>)
  const emailInput = utils.getByLabelText('Email')
  const passwordInput = utils.getByLabelText('Password')
  const submitButton = utils.getByText('Sign in')

  return {
    emailInput,
    passwordInput,
    submitButton,
    ...utils,
  }
}

describe('Authenticator', () => {
  it.skip('does not render children component when the user is not logged in', () => {
    render(<AuthProvider>{loggedInText}</AuthProvider>)

    expect(screen.queryByText(loggedInText)).not.toBeInTheDocument()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it.skip('renders children components when the user logged in successfully', async () => {
    const { emailInput, passwordInput, submitButton } = setup()

    fireEvent.change(emailInput, { target: { value: 'someuser@gmail.com' } })
    fireEvent.change(passwordInput, { target: { value: 'someone-password' } })

    fireEvent.click(submitButton)

    await waitFor(() => expect(screen.queryByText('Login')).not.toBeInTheDocument(), { timeout: 3000 })

    expect(screen.getByText(loggedInText)).toBeInTheDocument()
  })
})
