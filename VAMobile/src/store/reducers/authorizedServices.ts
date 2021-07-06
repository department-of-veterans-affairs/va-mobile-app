import { VAServicesConstants } from '../api/types'
import { contains } from 'underscore'
import { setAnalyticsUserProperties } from 'utils/analytics'
import createReducer from './createReducer'

export type AuthorizedServicesState = {
  hasLoaded: boolean
  error?: Error
  appeals: boolean
  appointments: boolean
  claims: boolean
  directDepositBenefits: boolean
  lettersAndDocuments: boolean
  militaryServiceHistory: boolean
  userProfileUpdate: boolean
  secureMessaging: boolean
}

export const initialAuthorizedServicesState: AuthorizedServicesState = {
  hasLoaded: false,
  appeals: false,
  appointments: false,
  claims: false,
  directDepositBenefits: false,
  lettersAndDocuments: false,
  militaryServiceHistory: false,
  userProfileUpdate: false,
  secureMessaging: false,
}

const initialState = initialAuthorizedServicesState

export default createReducer<AuthorizedServicesState>(initialState, {
  AUTHORIZED_SERVICES_UPDATE: (state, { authorizedServices = [], error }) => {
    const appeals = contains(authorizedServices, VAServicesConstants.Appeals)
    const appointments = contains(authorizedServices, VAServicesConstants.Appointments)
    const claims = contains(authorizedServices, VAServicesConstants.Claims)
    const directDepositBenefits = contains(authorizedServices, VAServicesConstants.DirectDepositBenefits)
    const lettersAndDocuments = contains(authorizedServices, VAServicesConstants.LettersAndDocuments)
    const militaryServiceHistory = contains(authorizedServices, VAServicesConstants.MilitaryServiceHistory)
    const userProfileUpdate = contains(authorizedServices, VAServicesConstants.UserProfileUpdate)
    const secureMessaging = contains(authorizedServices, VAServicesConstants.SecureMessaging)

    setAnalyticsUserProperties({
      appeals: appeals.toString(),
      appointments: appointments.toString(),
      claims: claims.toString(),
      directDepositBenefits: directDepositBenefits.toString(),
      lettersAndDocuments: lettersAndDocuments.toString(),
      militaryServiceHistory: militaryServiceHistory.toString(),
      userProfileUpdate: userProfileUpdate.toString(),
      secureMessaging: secureMessaging.toString(),
    })

    return {
      ...state,
      hasLoaded: true,
      appeals,
      appointments,
      claims,
      directDepositBenefits,
      lettersAndDocuments,
      militaryServiceHistory,
      userProfileUpdate,
      secureMessaging,
      error: error,
    }
  },
  AUTHORIZED_SERVICES_CLEAR: () => {
    return {
      ...initialAuthorizedServicesState,
    }
  },
})
