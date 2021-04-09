import {context, realStore} from 'testUtils'
import _ from 'underscore'
import {updateSecureMessagingTab} from './secureMessaging'
import {SecureMessagingTabTypesConstants} from '../api/types'

context('secureMessaging', () => {
  describe('updateSecureMessagingTab', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))

      const actions = store.getActions()
      const action  = _.find(actions, { type: 'SECURE_MESSAGING_UPDATE_TAB' })
      expect(action).toBeTruthy()
    })
  })
})
