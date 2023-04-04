import { includes } from 'underscore'

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

export const COVID19 = 'COVID-19'

export const SnackBarConstants: {
  animationDuration: number
  duration: number
} = {
  animationDuration: 100,
  duration: 900000,
}

const screensToCloseSnackbarOnNavigation = [
  'AppealDetailsScreen',
  'Appointments',
  'AskForClaimDecision',
  'ClaimDetails',
  'ClaimDetailsScreen',
  'ComposeMessage',
  'DirectDeposit',
  'EditDirectDeposit',
  'EditDraft',
  'EditPhoneNumber',
  'FileRequest',
  'FolderMessages',
  'PersonalInformation',
  'ContactInformation',
  'ReplyMessage',
  'SecureMessaging',
  'SelectFile',
  'TakePhotos',
  'UpcomingAppointmentDetails',
  'UploadFile',
  'UploadOrAddPhotos',
  'ViewMessageScreen',
]

export const CloseSnackbarOnNavigation = (screenName: string | undefined) => {
  if (screenName) {
    const screen = screenName.split('-')[0]
    if (includes(screensToCloseSnackbarOnNavigation, screen)) {
      snackBar?.hideAll()
    }
  }
}

export const DIRECT_DEPOSIT = 'Direct Deposit'

export const MAX_DIGITS = 10
export const MAX_DIGITS_AFTER_FORMAT = 14

export const EMAIL_REGEX_EXP = new RegExp(
  /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
)
export const ASCENDING = 'ascending'
