export const DirectDepositErrors = {
  INVALID_ROUTING_NUMBER: 'payment.accountRoutingNumber.invalidCheckSum',
  INVALID_ROUTING_NUMBER_TEXT: 'Financial institution routing number is invalid',
}

export type CommonErrorTypes = 'networkConnectionError' | 'appLevelError' | 'appLevelErrorWithRefresh' | 'appLevelErrorHealthLoad' | 'downtimeError'

export const CommonErrorTypesConstants: {
  NETWORK_CONNECTION_ERROR: CommonErrorTypes
  APP_LEVEL_ERROR: CommonErrorTypes
  APP_LEVEL_ERROR_WITH_REFRESH: CommonErrorTypes
  APP_LEVEL_ERROR_HEALTH_LOAD: CommonErrorTypes
  DOWNTIME_ERROR: CommonErrorTypes
} = {
  NETWORK_CONNECTION_ERROR: 'networkConnectionError',
  APP_LEVEL_ERROR: 'appLevelError',
  APP_LEVEL_ERROR_WITH_REFRESH: 'appLevelErrorWithRefresh',
  APP_LEVEL_ERROR_HEALTH_LOAD: 'appLevelErrorHealthLoad',
  DOWNTIME_ERROR: 'downtimeError',
}

export type SecureMessagingErrorCodesType = 'SM135' | 'SM129'

export const SecureMessagingErrorCodesConstants: {
  TERMS_AND_CONDITIONS: SecureMessagingErrorCodesType // need to accept new terms and conditions
  TRIAGE_ERROR: SecureMessagingErrorCodesType
} = {
  TERMS_AND_CONDITIONS: 'SM135',
  TRIAGE_ERROR: 'SM129',
}
