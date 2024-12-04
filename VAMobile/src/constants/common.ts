import { logAnalyticsEvent } from 'utils/analytics'

import { Events } from './analytics'

export const DEFAULT_PAGE_SIZE = 10
export const LARGE_PAGE_SIZE = 5000

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

export const COVID19 = 'COVID-19'

export const SnackBarConstants: {
  animationDuration: number
  duration: number
} = {
  animationDuration: 100,
  duration: 900000,
}

export const CloseSnackbarOnNavigation = (screenName: string | undefined) => {
  if (screenName) {
    if (!snackBar) {
      logAnalyticsEvent(Events.vama_snackbar_null(`CloseSnackbarOnNavigation - ${screenName.split('-')[0]}`))
    }
    snackBar?.hideAll()
  }
}

export const DIRECT_DEPOSIT = 'Direct Deposit'

export const MAX_DIGITS = 10
export const MAX_DIGITS_AFTER_FORMAT = 14

export const EMAIL_REGEX_EXP = new RegExp(
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)
export const MAIL_TO_REGEX_EXP = new RegExp(
  /^(mailto:([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)

export const PHONE_REGEX_EXP = new RegExp(
  /^\s*(?:\+?(\d{0,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *(x)(\d+))?,?.?\s*$/,
)

export const SSN_REGEX_EXP = new RegExp(/^\d{3}-?\d{2}-?\d{4}$/)

export const NUMBERS_ONLY_REGEX_EXP = new RegExp(/^[0-9]/)

export const URL_REGEX_EXP = new RegExp(/^((https:|http:)\S*)/)
export const URL2_REGEX_EXP = new RegExp(/^(www\.\S*)|^([a-zA-Z]*\.([a-z]){2,3})/)
export const ASCENDING = 'ascending'
export const DESCENDING = 'descending'

export const ACTIVITY_STALE_TIME = 300000 // 5 minutes
