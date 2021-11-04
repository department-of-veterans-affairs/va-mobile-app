import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { VAServices, VAServicesConstants } from '../api/types'
import { contains } from 'underscore'
import { setAnalyticsUserProperties } from 'utils/analytics'

export type AuthorizedServicesUpdatePayload = {
  authorizedServices?: Array<VAServices>
  error?: Error
}

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

const authorizedServicesSlice = createSlice({
  name: 'authorizedServices',
  initialState: initialAuthorizedServicesState,
  reducers: {
    dispatchUpdateAuthorizedServices: (state, action: PayloadAction<AuthorizedServicesUpdatePayload>) => {
      const { authorizedServices, error } = action.payload
      const services = authorizedServices || []

      const appeals = contains(services, VAServicesConstants.Appeals)
      const appointments = contains(services, VAServicesConstants.Appointments)
      const claims = contains(services, VAServicesConstants.Claims)
      const directDepositBenefits = contains(services, VAServicesConstants.DirectDepositBenefits)
      const lettersAndDocuments = contains(services, VAServicesConstants.LettersAndDocuments)
      const militaryServiceHistory = contains(services, VAServicesConstants.MilitaryServiceHistory)
      const userProfileUpdate = contains(services, VAServicesConstants.UserProfileUpdate)
      const secureMessaging = contains(services, VAServicesConstants.SecureMessaging)

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

      state.hasLoaded = true
      state.appeals = appeals
      state.appointments = appointments
      state.claims = claims
      state.directDepositBenefits = directDepositBenefits
      state.lettersAndDocuments = lettersAndDocuments
      state.militaryServiceHistory = militaryServiceHistory
      state.userProfileUpdate = userProfileUpdate
      state.secureMessaging = secureMessaging
      state.error = error
    },
    dispatchClearAuthorizedServices: () => {
      return {
        ...initialAuthorizedServicesState,
      }
    },
  },
})

export const { dispatchUpdateAuthorizedServices, dispatchClearAuthorizedServices } = authorizedServicesSlice.actions
export default authorizedServicesSlice.reducer
