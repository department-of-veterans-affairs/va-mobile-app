import _ from 'underscore'

import { context, realStore } from 'testUtils'
import { getActiveOrClosedClaimsAndAppeals, getAllClaimsAndAppeals, getAppeal, getClaim } from './claimsAndAppeals'

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
      expect(endAction?.state.claimsAndAppeals.loading).toBe(false)

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
      // TODO: add more tests when using the api instead of mocked data
      const store = realStore()
      await store.dispatch(getClaim('0'))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_START_GET_ClAIM' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'CLAIMS_AND_APPEALS_FINISH_GET_ClAIM' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.claimsAndAppeals.loading).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
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
      expect(endAction?.state.claimsAndAppeals.loading).toBe(false)

      const { claimsAndAppeals } = store.getState()
      expect(claimsAndAppeals.error).toBeFalsy()
    })
  })
})
