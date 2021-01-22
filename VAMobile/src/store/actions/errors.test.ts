import _ from "underscore";

import {context, realStore } from 'testUtils'
import { CommonErrors } from 'constants/errors'
import { setError, clearErrors } from "./errors";
import { initialErrorsState } from 'store/reducers';

context('errors', () => {
  describe('setError', () => {
    it('should set networkConnectionError to true', async () => {
      const store = realStore()
      await store.dispatch(setError(CommonErrors.NETWORK_CONNECTION_ERROR, true))
      const actions = store.getActions()

      const action = _.find(actions, { type: 'ERRORS_SET_ERROR'})
      expect(action?.state.errors.networkConnectionError).toBeTruthy()
    })
  })

  describe('clearErrors', () => {
    it('should set state to initial state', async () => {
      const store = realStore()

      await store.dispatch(setError(CommonErrors.NETWORK_CONNECTION_ERROR, true))
      let actions = store.getActions()
      let  action = _.find(actions, { type: 'ERRORS_SET_ERROR'})
      expect(action?.state.errors.networkConnectionError).toBeTruthy()

      await store.dispatch(clearErrors())
      actions = store.getActions()
      action = _.find(actions, { type: 'ERRORS_CLEAR_ERRORS'})
      expect(action?.state.errors).toEqual(initialErrorsState)
    })
  })
})
