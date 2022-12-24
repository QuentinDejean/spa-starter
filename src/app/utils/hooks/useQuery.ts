import useSWR, { SWRConfiguration } from 'swr'
import httpClient from '@app/libs/httpClient'

export enum RequestStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  ERROR = 'error',
}

type SuccessState<T> = {
  status: RequestStatus.SUCCESS
  data: T
}

type PendingState = {
  status: RequestStatus.PENDING
}

type ErrorState = {
  status: RequestStatus.ERROR
}

type State<T> = SuccessState<T> | PendingState | ErrorState

const useQuery = <T>(url: string, options?: SWRConfiguration): State<T> => {
  const { data, error } = useSWR<T>(url, httpClient, options)

  if (error) {
    return { status: RequestStatus.ERROR }
  }

  if (!error && !data) {
    return { status: RequestStatus.PENDING }
  }

  return { status: RequestStatus.SUCCESS, data: data as T }
}

export default useQuery
