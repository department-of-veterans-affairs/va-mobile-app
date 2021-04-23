import {context, realStore} from 'testUtils'
import _ from 'underscore'
import * as api from '../api'
import {downloadFileAttachment, updateSecureMessagingTab, updateToRead} from './secureMessaging'
import {SecureMessagingTabTypesConstants} from '../api/types'
import FileViewer from "react-native-file-viewer";

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


  describe('downloadFileAttachment', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()

      const attachmentTest: api.SecureMessagingAttachment =
          {
            id: 1,
            filename: 'testFile',
            link: '',
            size: 10
          }
      await store.dispatch(downloadFileAttachment(attachmentTest, ''))

      const actions = store.getActions()

      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.loadingFile).toBe(false)
      expect(FileViewer.open).toBeCalled()
    })
  })

  describe('updateToRead', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()
      const inbox: api.SecureMessagingMessageList =[
          {
            type: '',
            id: 987,
            attributes: {
              messageId: 1,
              category: 'COVID',
              subject: '',
              attachment: false,
              sentDate: '1/1/2021',
              senderId: 200,
              senderName: 'Alana P.',
              recipientId: 201,
              recipientName: 'Melvin P.',
            }
          },
      ]
      await store.dispatch(updateToRead(inbox[0].attributes.messageId))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_UPDATE_TO_READ' })
      expect(startAction).toBeTruthy()
      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_UPDATE_TO_READ' })
      expect(endAction).toBeTruthy()

    })
  })
})
