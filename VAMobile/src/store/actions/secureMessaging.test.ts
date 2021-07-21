import { context, realStore } from 'testUtils'
import _ from 'underscore'
import * as api from '../api'
import {
  dispatchClearLoadedMessages,
  downloadFileAttachment,
  getMessage,
  getMessageRecipients,
  resetReplyTriageError,
  resetSendMessageComplete,
  saveDraft,
  sendMessage,
  updateSecureMessagingTab,
} from './secureMessaging'
import { SecureMessagingTabTypesConstants, SecureMessagingFormData } from 'store/api/types'
import FileViewer from 'react-native-file-viewer'
import { when } from 'jest-when'
import { initialAuthState, initialErrorsState, initialSecureMessagingState } from '../reducers'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { contentTypes } from 'store/api/api'

context('secureMessaging', () => {
  describe('updateSecureMessagingTab', () => {
    it('should dispatch the correct action', async () => {
      const store = realStore()
      await store.dispatch(updateSecureMessagingTab(SecureMessagingTabTypesConstants.INBOX))

      const actions = store.getActions()
      const action = _.find(actions, { type: 'SECURE_MESSAGING_UPDATE_TAB' })
      expect(action).toBeTruthy()
    })
  })

  describe('downloadFileAttachment', () => {
    it('should dispatch the correct actions', async () => {
      const store = realStore()

      const attachmentTest: api.SecureMessagingAttachment = {
        id: 1,
        filename: 'testFile',
        link: '',
        size: 10,
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
      auth: { ...initialAuthState },
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
          },
        },
        inboxMessages: [
          {
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
            },
          },
        ],
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

    it('should return error and set messageIDsOfError to correct value if it fails', async () => {
      const error = new Error('backend error')
      const messageID = 1

      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/messages/${messageID}`)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(getMessage(1))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_MESSAGE' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
      expect(secureMessaging.messageIDsOfError).toEqual([messageID])
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
            relationType: 'PATIENT',
          },
        },
      ]

      when(api.get as jest.Mock)
        .calledWith('/v0/messaging/health/recipients')
        .mockResolvedValue({
          data,
          meta: {
            sort: {
              name: 'ASC',
            },
          },
        })

      const store = realStore()
      await store.dispatch(getMessageRecipients())

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_RECIPIENTS' })
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
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_GET_RECIPIENTS' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_GET_RECIPIENTS' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })
  })

  describe('getMessageRecipients', () => {
    const store = realStore({
      auth: { ...initialAuthState },
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
          },
        },
        inboxMessages: [
          {
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
            },
          },
        ],
      },
      errors: initialErrorsState,
    })

    store.dispatch(dispatchClearLoadedMessages())
    const actions = store.getActions()
    const clearAction = _.find(actions, { type: 'SECURE_MESSAGING_CLEAR_LOADED_MESSAGES' })
    expect(clearAction).toBeTruthy()
    const { secureMessaging } = store.getState()
    expect(secureMessaging).toEqual(initialSecureMessagingState)
  })

  describe('saveDraft', () => {
    const messageData = { recipient_id: 123456, category: 'APPOINTMENTS', subject: 'Draft subject', body: 'Draft text' } as SecureMessagingFormData

    it('should dispatch the correct action for saving a new draft', async () => {
      const store = realStore()
      await store.dispatch(saveDraft(messageData))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/message_drafts', messageData)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SAVE_DRAFT' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.savingDraft).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.savingDraft).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/message_drafts', messageData)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should dispatch the correct action for saving a new reply draft', async () => {
      const store = realStore()
      await store.dispatch(saveDraft(messageData, undefined, true, 1234))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/message_drafts/1234/replydraft', messageData)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SAVE_DRAFT' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.savingDraft).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.savingDraft).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/message_drafts/1234/replydraft', messageData)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should dispatch the correct action for saving an existing draft', async () => {
      const messageID = 12345
      const store = realStore()
      await store.dispatch(saveDraft(messageData, messageID))

      when(api.put as jest.Mock)
        .calledWith(`/v0/messaging/health/message_drafts/${messageID}`, messageData, undefined)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SAVE_DRAFT' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.savingDraft).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.savingDraft).toBeFalsy()

      expect(api.put as jest.Mock).toBeCalledWith(`/v0/messaging/health/message_drafts/${messageID}`, messageData)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should dispatch the correct action for saving an existing reply draft', async () => {
      const store = realStore()
      await store.dispatch(saveDraft(messageData, 5678, true, 1234))

      when(api.put as jest.Mock)
        .calledWith('/v0/messaging/health/message_drafts/1234/replydraft/5678', messageData)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SAVE_DRAFT' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.savingDraft).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.savingDraft).toBeFalsy()

      expect(api.put as jest.Mock).toBeCalledWith('/v0/messaging/health/message_drafts/1234/replydraft/5678', messageData)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })
  })

  describe('sendMessage', () => {
    const messageData = { recipient_id: 123456, category: 'APPOINTMENTS', subject: 'Subject', body: 'Message text' } as SecureMessagingFormData
    const file1: ImagePickerResponse = {
      uri: 'theFileUri',
      fileName: 'Image file name',
      type: 'image',
    }

    const file2: DocumentPickerResponse = {
      uri: 'theFileUri',
      fileCopyUri: 'file copy uri',
      name: 'Document file name',
      type: 'image',
      size: 10,
    }
    const uploads: Array<ImagePickerResponse | DocumentPickerResponse> = [file1, file2]

    it('should dispatch the correct action for sending attachment-less message', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, []))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages', messageData, undefined)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/messages', messageData, undefined)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should return error if sending attachment-less message fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages', messageData, undefined)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData, []))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })

    it('should dispatch the correct action for sending message with attachments', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, uploads))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages', expect.anything(), contentTypes.multipart)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/messages', expect.anything(), contentTypes.multipart)
      // TODO: figure out how to test values of FormData getting passed in

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should return error if sending message with attachment fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages', expect.anything(), contentTypes.multipart)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData, uploads))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })

    it('should dispatch the correct action for sending attachment-less reply', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, [], 1))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages/1/reply', messageData, undefined)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/messages/1/reply', messageData, undefined)

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should return error if sending attachment-less reply fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages/1/reply', messageData, undefined)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData, [], 1))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()
      expect(endAction?.state.secureMessaging.error).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })

    it('should dispatch the correct action for sending reply with attachments', async () => {
      const store = realStore()
      await store.dispatch(sendMessage(messageData, uploads, 1))

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages/1/reply', expect.anything(), contentTypes.multipart)
        .mockResolvedValue({})

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
      expect(startAction).toBeTruthy()
      expect(startAction?.state.secureMessaging.sendingMessage).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE' })
      expect(endAction).toBeTruthy()
      expect(endAction?.state.secureMessaging.sendingMessage).toBeFalsy()

      expect(api.post as jest.Mock).toBeCalledWith('/v0/messaging/health/messages/1/reply', expect.anything(), contentTypes.multipart)
      // TODO: figure out how to test values of FormData getting passed in

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toBeFalsy()
    })

    it('should return error if sending message with reply fails', async () => {
      const error = new Error('backend error')

      when(api.post as jest.Mock)
        .calledWith('/v0/messaging/health/messages/1/reply', expect.anything(), contentTypes.multipart)
        .mockResolvedValue(Promise.reject(error))

      const store = realStore()
      await store.dispatch(sendMessage(messageData, uploads, 1))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_SEND_MESSAGE' })
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
        },
      })
      await store.dispatch(resetSendMessageComplete())
      const actions = store.getActions()
      const action = _.find(actions, { type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE' })
      expect(action).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.sendMessageComplete).toEqual(false)
    })
  })
})

describe('resetReplyTriageError', () => {
  it('should dispatch the correct action', async () => {
    const store = realStore({
      secureMessaging: {
        ...initialSecureMessagingState,
        replyTriageError: true,
      },
    })
    await store.dispatch(resetReplyTriageError())
    const actions = store.getActions()
    const action = _.find(actions, { type: 'SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR' })
    expect(action).toBeTruthy()

    const { secureMessaging } = store.getState()
    expect(secureMessaging.replyTriageError).toEqual(false)
  })
})
