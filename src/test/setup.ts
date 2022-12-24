/* eslint-disable import/no-extraneous-dependencies */
import matchers from '@testing-library/jest-dom/matchers'
import { vi } from 'vitest'
import { fetch } from 'cross-fetch'
import { setupServer } from 'msw/node'
import { cleanup } from '@testing-library/react'

import handlers from './handler'

// mock auth logic (getting token and refreshing token from localStorage.)
vi.mock('@app/libs/auth')

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers)

global.fetch = fetch

const server = setupServer(...handlers)

beforeAll(() => server.listen({ onUnhandledRequest: `error` }))
afterAll(() => server.close())
afterEach(() => {
  cleanup()
  server.resetHandlers()
})

export default server
