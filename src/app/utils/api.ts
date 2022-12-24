import environment from '@app/libs/environment'

const someAPI = (path: string) => `${environment.someAPI}${path}`

export default someAPI
