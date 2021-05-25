import { VAServicesConstants } from '../api/types'
import { contains } from 'underscore'
import createReducer from './createReducer'

export type AuthorizedServicesState = {
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
    return {
      ...state,
      appeals: contains(authorizedServices, VAServicesConstants.Appeals),
      appointments: contains(authorizedServices, VAServicesConstants.Appointments),
      claims: contains(authorizedServices, VAServicesConstants.Claims),
      directDepositBenefits: contains(authorizedServices, VAServicesConstants.DirectDepositBenefits),
      lettersAndDocuments: contains(authorizedServices, VAServicesConstants.LettersAndDocuments),
      militaryServiceHistory: contains(authorizedServices, VAServicesConstants.MilitaryServiceHistory),
      userProfileUpdate: contains(authorizedServices, VAServicesConstants.UserProfileUpdate),
      secureMessaging: contains(authorizedServices, VAServicesConstants.SecureMessaging),
      error: error,
    }
  },
})
