export const DEFAULT_PAGE_SIZE = 10

export type EnvironmentTypes = 'staging' | 'production'

export const EnvironmentTypesConstants: {
  Staging: EnvironmentTypes
  Production: EnvironmentTypes
} = {
  Staging: 'staging',
  Production: 'production',
}

export type LoadingStatusTypes = 'init' | 'loading' | 'success' | 'error'

export const LoadingStatusTypeConstants: {
  INIT: LoadingStatusTypes
  LOADING: LoadingStatusTypes
  SUCCESS: LoadingStatusTypes
  ERROR: LoadingStatusTypes
} = {
  INIT: 'init',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export type WebProtocolTypes = 'http'

export const WebProtocolTypesConstants: {
  http: WebProtocolTypes
} = {
  http: 'http',
}
