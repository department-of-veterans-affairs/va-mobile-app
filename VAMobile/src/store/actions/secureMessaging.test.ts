import {context, realStore} from 'testUtils'
import _ from 'underscore'
import * as api from '../api'
import {
  dispatchClearLoadedMessages,
  downloadFileAttachment,
  getMessage,
  getMessageRecipients,
  resetSendMessageComplete,
  sendMessage,
  updateSecureMessagingTab,
} from './secureMessaging'
import {SecureMessagingTabTypesConstants} from '../api/types'
import FileViewer from "react-native-file-viewer";
import {when} from 'jest-when'
import {initialAuthState, initialErrorsState, initialSecureMessagingState} from "../reducers";

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

  describe('getMessage', () => {
    const store = realStore({
      auth: {...initialAuthState},
      secureMessaging: {
        ...initialSecureMessagingState,
        inbox: {
          type: 'Inbox',
          id: '123',
          attributes: {
            folderId: 123,
            name: 'Inbox',
            count: 100,
            unreadCount: 19,
            systemFolder: true,
          }
        },
        inboxMessages : [{
          type: '',
          id: 987,
          attributes: {
            messageId: 1, // ID of the message you just read
            category: 'COVID',
            subject: '',
            attachment: false,
            sentDate: '1/1/2021',
            senderId: 200,
            senderName: 'Alana P.',
            recipientId: 201,
            recipientName: 'Melvin P.',
          }
        }]
      },
      errors: initialErrorsState,
    })

    it('should dispatch the correct actions', async () => {

      await store.dispatch(getMessage(1))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_MESSAGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE' })
      expect(endAction).toBeTruthy()

    })
  })

  describe('getMessageRecipients', () => {
    it('should dispatch the correct action', async () => {
      const data = [
        {
          id: 'id',
          type: 'type',
          attributes: {
            triageTeamId: 0,
            name: 'Doctor 1',
            relationType: 'PATIENT'
          }
        },
      ]

      when(api.get as jest.Mock)
      .calledWith('/v0/messaging/health/recipients')
      .mockResolvedValue({
        data,
        meta: {
          sort: {
            name: 'ASC'
          }
        }
      })

      const store = realStore()
      await store.dispatch(getMessageRecipients())

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_RECIPIENTS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_GET_RECIPIENTS' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
      expect(secureMessaging.recipients).toEqual(data)
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')

      when(api.get as jest.Mock)
      .calledWith('/v0/messaging/health/recipients')
      .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(getMessageRecipients('SECURE_MESSAGING_COMPOSE_MESSAGE_SCREEN'))

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_RECIPIENTS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_GET_RECIPIENTS' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })
  })

  describe('getMessageRecipients', () => {
    const store = realStore({
      auth: {...initialAuthState},
      secureMessaging: {
        ...initialSecureMessagingState,
        inbox: {
          type: 'Inbox',
          id: '123',
          attributes: {
            folderId: 1,
            name: 'Inbox',
            count: 100,
            unreadCount: 19,
            systemFolder: true,
          }
        },
        inboxMessages : [{
          type: '',
          id: 987,
          attributes: {
            messageId: 1, // ID of the message you just read
            category: 'COVID',
            subject: '',
            attachment: false,
            sentDate: '1/1/2021',
            senderId: 200,
            senderName: 'Alana P.',
            recipientId: 201,
            recipientName: 'Melvin P.',
          }
        }]
      },
      errors: initialErrorsState,
    })

    store.dispatch(dispatchClearLoadedMessages())
    const actions = store.getActions()
    const clearAction  = _.find(actions, { type: 'SECURE_MESSAGING_CLEAR_LOADED_MESSAGES' })
    expect(clearAction).toBeTruthy()
    const { secureMessaging } = store.getState()
    expect(secureMessaging).toEqual(initialSecureMessagingState)
  })

  describe('sendMessage', () => {
    const messageData =
        { recipient_id: 123456,
          category: 'APPOINTMENTS',
          subject: 'Subject',
          body: 'Message text'
        }
    it('should dispatch the correct action for compose form send', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, []))

      when(api.post as jest.Mock)
          .calledWith('/v0/messaging/health/messages', (messageData as unknown) as api.Params)
          .mockResolvedValue({})

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect((api.post as jest.Mock)).toBeCalledWith('/v0/messaging/health/messages', (messageData as unknown) as api.Params)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should dispatch the correct action for reply form send', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, [], 1))

      when(api.post as jest.Mock)
          .calledWith('/v0/messaging/health/messages/1/reply', (messageData as unknown) as api.Params)
          .mockResolvedValue({})

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect((api.post as jest.Mock)).toBeCalledWith('/v0/messaging/health/messages/1/reply', (messageData as unknown) as api.Params)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should return error if compose form send fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock).calledWith('/v0/messaging/health/messages', (messageData as unknown) as api.Params).mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData))

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })

    it('should return error if reply form send fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock).calledWith('/v0/messaging/health/messages/1/reply', (messageData as unknown) as api.Params).mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData))

      const actions = store.getActions()
      const startAction  = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })
  })

  describe('resetSendMessageComplete', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore({
            secureMessaging: {
              ...initialSecureMessagingState,
              sendMessageComplete: true,
            }
          }
      )
      await store.dispatch(resetSendMessageComplete())
      const actions = store.getActions()
      const action  = _.find(actions, { type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE' })
      expect(action).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.sendMessageComplete).toEqual(false)
    })
  })
})
