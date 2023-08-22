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
  decisionLetters: boolean
  directDepositBenefits: boolean
  directDepositBenefitsUpdate: boolean
  lettersAndDocuments: boolean
  militaryServiceHistory: boolean
  userProfileUpdate: boolean
  secureMessaging: boolean
  scheduleAppointments: boolean
  prescriptions: boolean
}

export const initialAuthorizedServicesState: AuthorizedServicesState = {
  hasLoaded: false,
  appeals: false,
  appointments: false,
  claims: false,
  decisionLetters: false,
  directDepositBenefits: false, // User can view, but not edit their Direct Deposit
  directDepositBenefitsUpdate: false, // User can view and update their Direct Deposit
  lettersAndDocuments: false,
  militaryServiceHistory: false,
  userProfileUpdate: false,
  secureMessaging: false,
  scheduleAppointments: false,
  prescriptions: false,
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
      const decisionLetters = contains(services, VAServicesConstants.DecisionLetters)
      const directDepositBenefits = contains(services, VAServicesConstants.DirectDepositBenefits)
      const directDepositBenefitsUpdate = contains(services, VAServicesConstants.DirectDepositBenefitsUpdate)
      const lettersAndDocuments = contains(services, VAServicesConstants.LettersAndDocuments)
      const militaryServiceHistory = contains(services, VAServicesConstants.MilitaryServiceHistory)
      const userProfileUpdate = contains(services, VAServicesConstants.UserProfileUpdate)
      const secureMessaging = contains(services, VAServicesConstants.SecureMessaging)
      const scheduleAppointments = contains(services, VAServicesConstants.ScheduleAppointments)
      const prescriptions = contains(services, VAServicesConstants.Prescriptions)

      setAnalyticsUserProperties({
        appeals: appeals.toString(),
        appointments: appointments.toString(),
        claims: claims.toString(),
        decisionLetters: decisionLetters.toString(),
        directDepositBenefits: directDepositBenefits.toString(),
        lettersAndDocuments: lettersAndDocuments.toString(),
        militaryServiceHistory: militaryServiceHistory.toString(),
        userProfileUpdate: userProfileUpdate.toString(),
        secureMessaging: secureMessaging.toString(),
        scheduleAppointments: scheduleAppointments.toString(),
        prescriptions: prescriptions.toString(),
      })

      state.hasLoaded = true
      state.appeals = appeals
      state.appointments = appointments
      state.claims = claims
      state.decisionLetters = decisionLetters
      state.directDepositBenefits = directDepositBenefits
      state.directDepositBenefitsUpdate = directDepositBenefitsUpdate
      state.lettersAndDocuments = lettersAndDocuments
      state.militaryServiceHistory = militaryServiceHistory
      state.userProfileUpdate = userProfileUpdate
      state.secureMessaging = secureMessaging
      state.scheduleAppointments = scheduleAppointments
      state.prescriptions = prescriptions
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
