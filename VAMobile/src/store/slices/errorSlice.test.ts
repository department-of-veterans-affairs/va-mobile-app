import { find } from 'underscore'

import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import {
  dispatchClearErrors,
  dispatchSetError,
  initialErrorsState,
  initializeErrorsByScreenID,
} from 'store/slices/errorSlice'
import { context, realStore } from 'testUtils'

export const ActionTypes: {
  ERRORS_SET_ERROR: string
  ERRORS_SET_DOWNTIME: string
  ERRORS_CLEAR_ERRORS: string
} = {
  ERRORS_SET_ERROR: 'error/dispatchSetError',
  ERRORS_SET_DOWNTIME: 'error/dispatchSetDowntime',
  ERRORS_CLEAR_ERRORS: 'error/dispatchClearErrors',
}

context('errors', () => {
  describe('setError', () => {
    it('should set networkConnectionError for screenID to true', async () => {
      const store = realStore()
      const expectedErrorsByScreenID = initializeErrorsByScreenID()
      expectedErrorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] =
        CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      store.dispatch(
        dispatchSetError({
          errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
          screenID: ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID,
        }),
      )
      expect(store.getState().errors.errorsByScreenID).toEqual(expectedErrorsByScreenID)
    })
  })

  describe('clearErrors', () => {
    it('should set state to initial state', async () => {
      const store = realStore()
      const expectedErrorsByScreenID = initializeErrorsByScreenID()
      expectedErrorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] =
        CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      store.dispatch(
        dispatchSetError({
          errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
          screenID: ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID,
        }),
      )
      let actions = store.getActions()
      let action = find(actions, { type: ActionTypes.ERRORS_SET_ERROR })
      expect(action?.state.errors.errorsByScreenID).toEqual(expectedErrorsByScreenID)

      store.dispatch(dispatchClearErrors(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
      actions = store.getActions()
      action = find(actions, { type: ActionTypes.ERRORS_CLEAR_ERRORS })
      expect(action?.state.errors).toEqual(initialErrorsState)
    })
  })
})
