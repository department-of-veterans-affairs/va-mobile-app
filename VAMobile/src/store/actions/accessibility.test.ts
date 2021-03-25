import {context, realStore} from 'testUtils'
import {updateCurrentFontScale, updateCurrentIsVoiceOverTalkBackRunning} from './accessibility'
import _ from 'underscore'

context('accessibility', () => {
  describe('updateCurrentFontScale', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateCurrentFontScale(2))

      const actions = store.getActions()
      const action  = _.find(actions, { type: 'FONT_SCALE_UPDATE' })
      expect(action).toBeTruthy()
    })
  })

  describe('updateCurrentIsVoiceOverTalkBackRunning', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateCurrentIsVoiceOverTalkBackRunning(true))

      const actions = store.getActions()
      const action  = _.find(actions, { type: 'IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE' })
      expect(action).toBeTruthy()
    })
  })
})
