import { QueryKey } from '@tanstack/react-query'

export type ErrorData = {
  errors: Array<errors>
}

export type errors = {
  queryKey: QueryKey
  error: networkError | errorOverride
}

export type networkError = {
  networkError: boolean
}

export type errorOverride = {
  status: number
  endpoint: string
  text: string
  json: any
}
