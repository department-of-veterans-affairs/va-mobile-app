import { ErrorMessage } from 'store/api'

export type errors = {
  endpoint: string
  error: networkError | errorOverride
}

export type networkError = {
  networkError: boolean
}

export type errorOverride = {
  status: number
  endpoint: string
  text: string
  json?: {
    errors: Array<{
      title: string
      detail: string
      code: string
      source: string
      body?: string
      telephone?: string
      refreshable?: boolean
      meta?: {
        messages?: Array<ErrorMessage>
      }
    }>
  }
}
