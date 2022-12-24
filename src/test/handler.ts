/* eslint-disable import/no-extraneous-dependencies */
import { rest } from 'msw'

import someAPI from '@app/utils/api'

const handlers = [
  rest.get(someAPI('/some-api'), (req, res, ctx) => res(ctx.json({}))),
  rest.post(someAPI('/some-api'), (req, res, ctx) => res(ctx.json({}))),
]

export default handlers
