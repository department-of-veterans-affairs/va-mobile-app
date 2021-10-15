import { find } from 'underscore'

import { context, realStore } from 'testUtils'
import { getVaccines } from './vaccine'

context('vaccine', () => {
  describe('getVaccines', () => {
    it('should get the users vaccine list', async () => {
      const store = realStore()
      await store.dispatch(getVaccines())
      const actions = store.getActions()

      const startAction = find(actions, { type: 'VACCINE_START_GET_VACCINES' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.vaccine.loading).toBeTruthy()

      const finishAction = find(actions, { type: 'VACCINE_FINISH_GET_VACCINES' })
      expect(finishAction).toBeTruthy()
      expect(finishAction?.state.vaccine.loading).toBeFalsy()
    })
  })
})
