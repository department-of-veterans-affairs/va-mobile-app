import { ClaimGetData, ClaimsAndAppealsGetData } from '../types'
import { DemoStore } from './store'
import { Params } from '../api'

export type ClaimsDemoStore = {
  '/v0/claims-and-appeals-overview': {
    open: ClaimsAndAppealsGetData
    closed: ClaimsAndAppealsGetData
  }
  '/v0/claim/600232852': ClaimGetData
  '/v0/claim/600236068': ClaimGetData
}

export type ClaimsDemoApiReturnTypes = ClaimGetData | ClaimsAndAppealsGetData

export const getClaimsAndAppealsOverview = (store: DemoStore, params: Params): ClaimsAndAppealsGetData => {
  if (params.showCompleted === 'false') {
    return store['/v0/claims-and-appeals-overview'].open
  } else {
    return store['/v0/claims-and-appeals-overview'].closed
  }
}
