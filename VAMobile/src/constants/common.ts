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

export const SnackBarConstants: {
  animationDuration: number
  duration: number
} = {
  animationDuration: 100,
  duration: 900000,
}

const screensToCloseSnackbarOnNavigation = [
  'TakePhotos',
  'SelectFile',
  'UploadFile',
  'UploadOrAddPhotos',
  'ClaimDetails',
  'EditDraft',
  'FolderMessages',
  'SecureMessaging',
  'ViewMessage',
  'SecureMessaging',
  'PersonalInformation',
  'DirectDeposit',
  'EditDirectDeposit',
  'FileRequest',
  'AppealDetailsScreen',
  'ClaimDetailsScreen',
  'AskForClaimDecision',
  'EditPhoneNumber',
]

export const CloseSnackbarOnNavigation = (screenName: string | undefined) => {
  if (screenName) {
    const screen = screenName.split('-')[0]
    if (includes(screensToCloseSnackbarOnNavigation, screen)) {
      snackBar.hideAll()
    }
  }
}

export const DIRECT_DEPOSIT = 'Direct Deposit'
