import {context, realStore} from 'testUtils'
import {updateCurrentFontScale} from './accessibility'
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
})
