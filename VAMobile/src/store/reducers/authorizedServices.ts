import { VAServicesConstants } from '../api/types'
import { contains } from 'underscore'
import createReducer from './createReducer'

export type AuthorizedServicesState = {
  error?: Error
  hasDirectDepositBenefits: boolean
}

export const initialAuthorizedServicesState: AuthorizedServicesState = {
  hasDirectDepositBenefits: false,
}

const initialState = initialAuthorizedServicesState

export default createReducer<AuthorizedServicesState>(initialState, {
  AUTHORIZED_SERVICES_UPDATE: (state, { authorizedServices, error }) => {
    return {
      ...state,
      hasDirectDepositBenefits: contains(authorizedServices || [], VAServicesConstants.DirectDepositBenefits),
      error: error,
    }
  },
})
