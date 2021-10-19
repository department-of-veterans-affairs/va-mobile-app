import { find } from 'underscore'
import { when } from 'jest-when'
import { DateTime, Settings } from 'luxon'

import { context, realStore } from 'testUtils'
import { CommonErrorTypesConstants } from 'constants/errors'
import { dispatchClearErrors, dispatchSetError, dispatchCheckForDowntimeErrors } from './errors'
import { initialErrorsState, initializeErrorsByScreenID } from 'store/reducers'
import { ScreenIDTypesConstants, MaintenanceWindowsGetData } from '../api/types'
import * as api from '../api'

context('errors', () => {
  describe('setError', () => {
    it('should set networkConnectionError for screenID to true', async () => {
      const store = realStore()
      const expectedErrorsByScreenID = initializeErrorsByScreenID()
      expectedErrorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      store.dispatch(dispatchSetError(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR, ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
      expect(store.getState().errors.errorsByScreenID).toEqual(expectedErrorsByScreenID)
    })
  })

  describe('clearErrors', () => {
    it('should set state to initial state', async () => {
      const store = realStore()
      const expectedErrorsByScreenID = initializeErrorsByScreenID()
      expectedErrorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      store.dispatch(dispatchSetError(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR, ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
      let actions = store.getActions()
      let action = find(actions, { type: 'ERRORS_SET_ERROR' })
      expect(action?.state.errors.errorsByScreenID).toEqual(expectedErrorsByScreenID)

      store.dispatch(dispatchClearErrors(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
      actions = store.getActions()
      action = find(actions, { type: 'ERRORS_CLEAR_ERRORS' })
      expect(action?.state.errors).toEqual(initialErrorsState)
    })
  })

  describe('when getting maintenance windows', () => {
    const initializeMaintenanceWindows = async () => {
      const expectNow = DateTime.utc(2021, 6, 1, 15)
      Settings.now = () => expectNow.toMillis()

      const mockMaintenanceWindows: MaintenanceWindowsGetData = {
        data: [
          {
            service: 'direct_deposit_benefits',
            startTime: '2021-06-01T12:00:00.000Z',
            endTime: '2021-06-01T18:00:00.000Z',
            description: 'active maintenance window',
          },
          {
            service: 'military_service_history',
            startTime: '2021-06-01T12:00:00.000Z',
            endTime: '2021-06-01T18:00:00.000Z',
            description: 'active maintenance window',
          },
          {
            service: 'secure_messaging',
            startTime: '2021-06-01T20:00:00.000Z',
            endTime: '2021-06-01T23:00:00.000Z',
            description: 'future maintenance window',
          },
          {
            service: 'auth_idme',
            startTime: '2021-06-01T12:00:00.000Z',
            endTime: '2021-06-01T18:00:00.000Z',
            description: 'active maintenance window but unmapped service',
          },
        ]
      }

      when(api.get as jest.Mock)
        .calledWith('/v0/maintenance_windows')
        .mockResolvedValue(mockMaintenanceWindows)

      const store = realStore()
      await store.dispatch(dispatchCheckForDowntimeErrors())
      return store
    }

    it('should call expected store functions', async () => {
      const store = await initializeMaintenanceWindows()
      const actions = store.getActions()

      const clearMetadata = find(actions, { type: 'ERRORS_CLEAR_ALL_METADATA' })
      expect(clearMetadata).toBeTruthy()
      const clearErrors = find(actions, { type: 'ERRORS_CLEAR_ERROR_TYPE' })
      expect(clearErrors).toBeTruthy()
      const setErrors = find(actions, { type: 'ERRORS_SET_ERROR' })
      expect(setErrors).toBeTruthy()
      const setMetadata = find(actions, { type: 'ERRORS_SET_METADATA' })
      expect(setMetadata).toBeTruthy()
    })

    it('should mark downtime for active maintenance windows', async () => {
      const store = await initializeMaintenanceWindows()

      expect(store.getState().errors.errorsByScreenID).toMatchObject({
        [ScreenIDTypesConstants.DIRECT_DEPOSIT_SCREEN_ID]: CommonErrorTypesConstants.DOWNTIME_ERROR,
        [ScreenIDTypesConstants.MILITARY_INFORMATION_SCREEN_ID]: CommonErrorTypesConstants.DOWNTIME_ERROR,
      })
    })

    it('should not mark downtime for future maintenance windows', async () => {
      const store = await initializeMaintenanceWindows()

      expect(store.getState().errors.errorsByScreenID).toMatchObject({
        [ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID]: undefined,
      })
    })
  })
})