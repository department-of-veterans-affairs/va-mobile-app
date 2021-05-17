export const DirectDepositErrors = {
  INVALID_ROUTING_NUMBER: 'payment.accountRoutingNumber.invalidCheckSum',
}

export type CommonErrorTypes = 'networkConnectionError' | 'appLevelError' | 'appLevelErrorWithRefresh' | 'appLevelErrorLoadMessages' | 'appLevelErrorIndividualMsg'

export const CommonErrorTypesConstants: {
  NETWORK_CONNECTION_ERROR: CommonErrorTypes
  APP_LEVEL_ERROR: CommonErrorTypes
  APP_LEVEL_ERROR_WITH_REFRESH: CommonErrorTypes
  APP_LEVEL_ERROR_LOAD_MESSAGES: CommonErrorTypes
  APP_LEVEL_ERROR_INDIVIDUAL_MSG: CommonErrorTypes
} = {
  NETWORK_CONNECTION_ERROR: 'networkConnectionError',
  APP_LEVEL_ERROR: 'appLevelError',
  APP_LEVEL_ERROR_WITH_REFRESH: 'appLevelErrorWithRefresh',
  APP_LEVEL_ERROR_LOAD_MESSAGES: 'appLevelErrorLoadMessages',
  APP_LEVEL_ERROR_INDIVIDUAL_MSG: 'appLevelErrorIndividualMsg'
}
