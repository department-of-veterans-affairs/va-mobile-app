import _ from "underscore";

import {context, realStore } from 'testUtils'
import { CommonErrorTypesConstants } from 'constants/errors'
import { dispatchClearErrors, dispatchSetError} from "./errors";
import {initialErrorsState, initializeErrorsByScreenID} from 'store/reducers';
import {ScreenIDTypesConstants} from "../api/types";

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
      let  action = _.find(actions, { type: 'ERRORS_SET_ERROR'})
      expect(action?.state.errors.errorsByScreenID).toEqual(expectedErrorsByScreenID)

      store.dispatch(dispatchClearErrors(ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID))
      actions = store.getActions()
      action = _.find(actions, { type: 'ERRORS_CLEAR_ERRORS'})
      expect(action?.state.errors).toEqual(initialErrorsState)
    })
  })
})
