import { context, realStore } from 'testUtils'
import { find } from 'underscore'
import { toggleFirebaseDebugMode } from './analyticsSlice'

context('analytics', () => {
  describe('toggle firebase debug mode', () => {
    it('should toggle the debug mode when called', async () => {
      const store = realStore()
      let currentState = store.getStateField('analytics', 'firebaseDebugMode')
      await store.dispatch(toggleFirebaseDebugMode())

      const actions = store.getActions()
      const action = find(actions, { type: 'analytics/dispatchFirebaseDebugMode' })
      expect(action).toBeTruthy()

      expect(store.getStateField('analytics', 'firebaseDebugMode')).toEqual(!currentState)
    })
  })
})