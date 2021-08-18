export const DEFAULT_PAGE_SIZE = 10

export const EnvironmentTypesConstants: {
  Staging: EnvironmentTypes
  Production: EnvironmentTypes
} = {
  Staging: 'staging',
  Production: 'production',
}

export type EnvironmentTypes = 'staging' | 'production'

export type LoadingStatusTypes = 'init' | 'loading' | 'success'

export const LoadingStatusTypeConstants: {
  INIT: LoadingStatusTypes
  LOADING: LoadingStatusTypes
  SUCCESS: LoadingStatusTypes
} = {
  INIT: 'init',
  LOADING: 'loading',
  SUCCESS: 'success',
}
