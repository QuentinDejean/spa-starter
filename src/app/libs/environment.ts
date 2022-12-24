type Environment = {
  someAPI: string
}

if (!import.meta.env.VITE_SOME_API) {
  throw new Error('VITE_SOME_API is not defined')
}

const environment: Environment = {
  someAPI: import.meta.env.VITE_SOME_API,
}

export default environment
