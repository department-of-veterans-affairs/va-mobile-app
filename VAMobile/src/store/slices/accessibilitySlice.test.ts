import _ from 'underscore'

import { updateCurrentFontScale, updateCurrentIsVoiceOverTalkBackRunning } from 'store/slices/accessibilitySlice'
import { context, realStore } from 'testUtils'

context('accessibilitySlice', () => {
  describe('updateCurrentFontScale', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateCurrentFontScale(5))

      const actions = store.getActions()
      const action = _.find(actions, { type: 'accessibility/dispatchUpdateFontScale' })
      expect(action).toBeTruthy()

      expect(store.getStateField('accessibility', 'fontScale')).toEqual(5)
    })
  })

  describe('updateCurrentIsVoiceOverTalkBackRunning', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateCurrentIsVoiceOverTalkBackRunning(true))

      const actions = store.getActions()
      const action = _.find(actions, { type: 'accessibility/dispatchUpdateIsVoiceOverTalkBackRunning' })
      expect(action).toBeTruthy()

      expect(store.getStateField('accessibility', 'isVoiceOverTalkBackRunning')).toBeTruthy()
    })
  })
})
