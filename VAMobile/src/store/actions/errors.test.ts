import {context, realStore } from 'testUtils'
import { CommonErrorTypes } from "../reducers";
import { setError } from "./errors";
import _ from "underscore";

context('errors', () => {
  describe('setError', () => {
    it('should set networkConnectionError to true', async () => {
      const store = realStore()
      await store.dispatch(setError(CommonErrorTypes.NETWORK_CONNECTION_ERROR, true))
      const actions = store.getActions()

      const action = _.find(actions, { type: 'ERRORS_SET_ERROR'})
      expect(action?.state.errors.networkConnectionError).toBeTruthy()
    })
  })
})
