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

export const DIRECT_DEPOSIT = 'Direct Deposit'

export const MAX_DIGITS = 10
export const MAX_DIGITS_AFTER_FORMAT = 14

// ------------------
// REGEX PATTERNS FOR PII
// ------------------
export const EMAIL_REGEX_EXP_PII = new RegExp(
  /(?<![a-zA-Z0-9@._-])(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(?![a-zA-Z0-9@._-])/gi,
)

export const MAIL_TO_REGEX_EXP_PII = new RegExp(
  /(?<![a-zA-Z0-9@_-])(?:mailto:)?(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))(?![a-zA-Z0-9@_-])/gi,
)

export const PHONE_REGEX_EXP_PII = new RegExp(
  /(?<!\d)(?:\+?\d{1,3}[-.\s(]*)?\(?\d{3}\)?[-.\s]*\d{3}[-.\s]*\d{4}(?: *(?:x|ext)\.? *\d+)?(?!\d)/gi,
)

export const SSN_REGEX_EXP_PII = new RegExp(/(?<!\d)\d{3}-?\d{2}-?\d{4}(?!\d)/g)

// ------------------
// REGEX PATTERNS FOR LINKING TEXT
// ------------------
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
