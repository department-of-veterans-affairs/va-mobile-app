export type APIError = {
  status: number
  text: string
  json?: VAError
}

export type VAError = {
  errors: Array<{
    title: string
    detail: string
    code: string
    source: string
    meta?: {
      messages?: Array<VAErrorMessage>
    }
  }>
}

export type VAErrorMessage = {
  key: string
  severity: string
  text: string
}
