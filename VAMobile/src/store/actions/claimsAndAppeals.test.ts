import _ from 'underscore'

import * as api from '../api'
import { context, realStore, when } from 'testUtils'
import {
  getActiveOrClosedClaimsAndAppeals,
  getAllClaimsAndAppeals,
  getAppeal,
  getClaim,
  submitClaimDecision
} from './claimsAndAppeals'
import { claim as Claim } from 'screens/ClaimsScreen/claimData'

context('claimsAndAppeals', () => {
  describe('getAllClaimsAndAppeals', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getAllClaimsAndAppeals())

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ALL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ALL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingAllClaimsAndAppeals).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })

  describe('getActiveOrClosedClaimsAndAppeals', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getActiveOrClosedClaimsAndAppeals('ACTIVE'))

      const actions = store.getActions()

      const action = _.find(actions, { type: 'CLAIMS_AND_APPEALS_GET_ACTIVE_OR_CLOSED' })
      expect(action).toBeTruthy()

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })

  describe('getClaim', () => {
    it('should dispatch the correct actions', async () => {
      const claimsDetail: api.ClaimData = Claim

      when(api.get as jest.Mock)
          .calledWith('/v0/claim/245182')
          .mockResolvedValue({ data: claimsDetail })

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaim).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
      expect(claimsAndAppeals.claim).toEqual(claimsDetail) //claimsDetail
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
          .calledWith('/v0/claim/245182')
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getClaim('245182'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingClaim).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toEqual(error) //error

    })
  })

  describe('getAppeal', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getAppeal('0'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_APPEAL' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_APPEAL' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingAppeal).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })

  describe('submitClaimDecision', () => {
    it('should dispatch the correct actions', async () => {
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(submitClaimDecision('id'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_SUBMIT_CLAIM_DECISION' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_SUBMIT_CLAIM_DECISION' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loadingSubmitClaimDecision).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })
})
