export const DEFAULT_PAGE_SIZE = 10

export const EnvironmentTypesConstants: {
  Staging: EnvironmentTypes
  Production: EnvironmentTypes
} = {
  Staging: 'staging',
  Production: 'production',
}

export type EnvironmentTypes = 'staging' | 'production'

export type WebProtocolTypes = 'http'

export const WebProtocolTypesConstants: {
  http: WebProtocolTypes
} = {
  http: 'http',
}

export const MockUsersEmail: {
  user_1414: string
  user_1401: string
  user_1402: string
  user_226: string
  user_366: string
} = {
  user_1414: 'vets.gov.user+1414@gmail.com',
  user_1401: 'vets.gov.user+1401@gmail.com',
  user_1402: 'vets.gov.user+1402@gmail.com',
  user_226: 'vets.gov.user+226@gmail.com',
  user_366: 'vets.gov.user+366@gmail.com',
}

export const COVID19 = 'COVID-19'
