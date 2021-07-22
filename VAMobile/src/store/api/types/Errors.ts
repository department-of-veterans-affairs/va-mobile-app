// parent level error object that contains the status, text, and json properties from a fetch response stream
// used to keep full error information in respective stores
// json property is used to parse through to find error metadata
export type APIError = {
  status?: number
  text?: string
  networkError?: boolean
  json?: {
    errors: Array<{
      title: string
      detail: string
      code: string
      source: string
      meta?: {
        messages?: Array<ErrorMessage>
      }
    }>
  }
}

export type ErrorMessage = {
  key: string
  severity: string
  text: string
}
