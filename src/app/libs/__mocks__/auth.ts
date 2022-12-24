import { vi } from 'vitest'

const Authenticator = () => ({
  authenticate: vi.fn().mockResolvedValue({ access_token: 'token' }),
  getToken: vi.fn().mockReturnValue({ access_token: 'token' }),
  redirectToLogin: vi.fn(),
  refreshToken: vi.fn().mockResolvedValue({ access_token: 'token' }),
  revokeToken: vi.fn(),
})

const auth = Authenticator()

export default auth
