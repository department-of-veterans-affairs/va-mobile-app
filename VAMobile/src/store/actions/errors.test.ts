import _ from "underscore";

import {context, realStore } from 'testUtils'
import { CommonErrorTypesConstants } from 'constants/errors'
import { dispatchClearErrors, dispatchSetError} from "./errors";
import { initialErrorsState } from 'store/reducers';

context('errors', () => {
  describe('setError', () => {
    it('should set networkConnectionError to true', async () => {
      const store = realStore()

      store.dispatch(dispatchSetError(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR))
      expect(store.getState().errors.errorType).toEqual(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR)
    })
  })

  describe('clearErrors', () => {
    it('should set state to initial state', async () => {
      const store = realStore()

      store.dispatch(dispatchSetError(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR))
      let actions = store.getActions()
      let  action = _.find(actions, { type: 'ERRORS_SET_ERROR'})
      expect(action?.state.errors.errorType).toEqual(CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR)

      store.dispatch(dispatchClearErrors())
      actions = store.getActions()
      action = _.find(actions, { type: 'ERRORS_CLEAR_ERRORS'})
      expect(action?.state.errors).toEqual(initialErrorsState)
    })
  })
})
