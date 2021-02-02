export const DirectDepositErrors = {
  INVALID_ROUTING_NUMBER: 'payment.accountRoutingNumber.invalidCheckSum',
}

export type CommonErrorTypes = 'networkConnectionError' | 'appLevelError'

export const CommonErrorTypesConstants: {
  NETWORK_CONNECTION_ERROR: CommonErrorTypes
  APP_LEVEL_ERROR: CommonErrorTypes
} = {
  NETWORK_CONNECTION_ERROR: 'networkConnectionError',
  APP_LEVEL_ERROR: 'appLevelError',
}
