import { ClaimGetData, ClaimsAndAppealsGetData } from '../types'
import { DemoStore } from './store'
import { Params } from '../api'

/**
 * Type denoting the demo data store
 */
export type ClaimsDemoStore = {
  '/v0/claims-and-appeals-overview': {
    open: ClaimsAndAppealsGetData
    closed: ClaimsAndAppealsGetData
  }
  '/v0/claim/600232852': ClaimGetData
  '/v0/claim/600236068': ClaimGetData
  '/v0/claim/600246732': ClaimGetData
}

/**
 * Type to define the mock returns to keep type safety
 */
export type ClaimsDemoApiReturnTypes = ClaimGetData | ClaimsAndAppealsGetData

export const getClaimsAndAppealsOverview = (store: DemoStore, params: Params): ClaimsAndAppealsGetData => {
  if (params.showCompleted === 'false') {
    return store['/v0/claims-and-appeals-overview'].open
  } else {
    return store['/v0/claims-and-appeals-overview'].closed
  }
}
