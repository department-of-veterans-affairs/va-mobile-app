import { find } from 'underscore'

import { context, realStore } from 'testUtils'
import {getImmunizations} from './immunization'

context('immunization', () => {
  describe('getImmunizations', () => {
    it('should get the users immunization list', async () => {
      const store = realStore()
      await store.dispatch(getImmunizations())
      const actions = store.getActions()

      const startAction = find(actions, { type: 'IMMUNIZATION_START_GET_IMMUNIZATIONS' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.immunization.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'IMMUNIZATION_FINISH_GET_IMMUNIZATIONS' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.immunization.loading).toBeFalsy()
    })
  })
})
