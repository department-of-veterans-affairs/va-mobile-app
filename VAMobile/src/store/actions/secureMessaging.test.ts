import {context, realStore} from 'testUtils'
import _ from 'underscore'
import * as api from '../api'
import {
  downloadFileAttachment,
  fetchInboxMessages,
  getMessage,
  getMessageRecipients, listFolderMessages,
  updateSecureMessagingTab,
} from './secureMessaging'
import {SecureMessagingTabTypesConstants} from '../api/types'
import FileViewer from "react-native-file-viewer";
import {when} from 'jest-when'
import {initialAuthState, initialErrorsState, initialSecureMessagingState, InitialState} from '../reducers'
import {ScreenIDTypesConstants} from 'store/api/types/Screens'
import {DEFAULT_PAGE_SIZE} from 'constants/common'
import {SecureMessagingSystemFolderIdConstants} from 'store/api/types/SecureMessagingData'
import {CategoryTypes} from "../api";

const mockMessages = [
  {
    attributes:
        {
          attachment: true,
          body: '',
          category: 'EDUCATION' as CategoryTypes,
          messageId: 1926436,
          readReceipt: 'READ',
          recipientId: 523757,
          recipientName: 'FREEMAN, MELVIN  V',
          senderId: 1835650,
          senderName: 'RATANA, NARIN ',
          sentDate: '2021-04-28T19:43:21.000Z',
          subject: 'Vaccine Information'
        },
    id: 1926436,
    links:
        {
          'self': 'https://test-api.gov/mobile/v0/messaging/health/messages/1926436'
        },
    type: 'messages'
  },
  {
    attributes:
        {
          attachment: true,
          body: '',
          category: 'TEST_RESULTS' as CategoryTypes,
          messageId: 1926430,
          readReceipt: 'READ',
          recipientId: 523757,
          recipientName: 'FREEMAN, MELVIN  V',
          senderId: 1835650,
          senderName: 'RATANA, NARIN ',
          sentDate: '2021-04-28T19:40:26.000Z',
          subject: 'Your lab results'
        },
    id: 1926430,
    links:
        {
          'self': 'https://test-api.gov/mobile/v0/messaging/health/messages/1926430'
        },
    type: 'messages'
  },
]

const mockMeta = {
  sort: {
    sentDate: 'DESC'
  },
  pagination: {
    currentPage: 1,
    perPage: 10,
    totalEntries: 22,
    totalPages: 3,
  }
}

const mockLink = {
  first: "",
  last: "",
  next: "",
  prev: "",
  self: ""
}

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

  describe('fetchInboxMessages', () => {
    it('should return valid inbox messages', async () => {
      const store = realStore()
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      when(api.get as jest.Mock)
          .calledWith(`/v0/messaging/health/folders/${folderID}/messages`, { 'per_page': DEFAULT_PAGE_SIZE.toString(), 'page': '1'})
          .mockResolvedValue({ data: mockMessages, meta: mockMeta, links: mockLink})
      await store.dispatch(fetchInboxMessages(1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } =  store.getState()
      expect(secureMessaging.inboxMessages).toEqual(mockMessages)
      expect(secureMessaging.error).toBeFalsy()

      const inboxFolderID = SecureMessagingSystemFolderIdConstants.INBOX
      expect(secureMessaging.paginationMetaByFolderId?.[inboxFolderID]).toEqual(mockMeta.pagination)
      expect(secureMessaging.loadedMessagesByFolderId?.[inboxFolderID]).toEqual(mockMessages)
    })

    it('should use loadedMessagesByFolderId data when available', async () => {
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const store = realStore({
        ...InitialState,
        secureMessaging: {
          ...initialSecureMessagingState,
          loadedMessagesByFolderId: {
            ...initialSecureMessagingState.loadedMessagesByFolderId,
            [folderID]: mockMessages
          },
          paginationMetaByFolderId: {
            ...initialSecureMessagingState.paginationMetaByFolderId,
            [folderID]: mockMeta.pagination
          }
        }
      })

      await store.dispatch(fetchInboxMessages(1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      expect(api.get).not.toBeCalled()

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } =  store.getState()
      expect(secureMessaging.inboxMessages).toEqual(mockMessages)
      expect(secureMessaging.error).toBeFalsy()

      const inboxFolderID = SecureMessagingSystemFolderIdConstants.INBOX
      expect(secureMessaging.paginationMetaByFolderId?.[inboxFolderID]).toEqual({
        ...mockMeta.pagination,
        totalPages: 0, // value gets mocked
      })
      expect(secureMessaging.loadedMessagesByFolderId?.[inboxFolderID]).toEqual(mockMessages)
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      when(api.get as jest.Mock)
          .calledWith(`/v0/messaging/health/folders/${folderID}/messages`, { 'per_page': DEFAULT_PAGE_SIZE.toString(), 'page': '1'})
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(fetchInboxMessages(1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
    })
  })

  describe('listFolderMessages', () => {
    it('should return valid folder messages', async () => {
      const store = realStore()
      const folderID = SecureMessagingSystemFolderIdConstants.SENT
      when(api.get as jest.Mock)
          .calledWith(`/v0/messaging/health/folders/${folderID}/messages`, { 'per_page': DEFAULT_PAGE_SIZE.toString(), 'page': '1'})
          .mockResolvedValue({ data: mockMessages, meta: mockMeta, links: mockLink})
      await store.dispatch(listFolderMessages(folderID, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } =  store.getState()
      expect(secureMessaging.messagesByFolderId?.[folderID]).toEqual({ data: mockMessages, meta: mockMeta, links: mockLink})
      expect(secureMessaging.error).toBeFalsy()

      expect(secureMessaging.paginationMetaByFolderId?.[folderID]).toEqual(mockMeta.pagination)
      expect(secureMessaging.loadedMessagesByFolderId?.[folderID]).toEqual(mockMessages)
    })

    it('should use loadedMessagesByFolderId data when available', async () => {
      const folderID = SecureMessagingSystemFolderIdConstants.SENT
      const store = realStore({
        ...InitialState,
        secureMessaging: {
          ...initialSecureMessagingState,
          loadedMessagesByFolderId: {
            ...initialSecureMessagingState.loadedMessagesByFolderId,
            [folderID]: mockMessages
          },
          paginationMetaByFolderId: {
            ...initialSecureMessagingState.paginationMetaByFolderId,
            [folderID]: mockMeta.pagination
          }
        }
      })

      await store.dispatch(listFolderMessages(folderID, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      expect(api.get).not.toBeCalled()

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } =  store.getState()
      // Most meta values get mocked
      expect(secureMessaging.messagesByFolderId?.[folderID]).toEqual({ data: mockMessages, meta: {
          sort: {
            sentDate: ''
          },
          pagination: {
            ...mockMeta.pagination,
            totalPages: 0, // value gets mocked
          },
          dataFromStore: true,
        }, links: mockLink})
      expect(secureMessaging.error).toBeFalsy()

      expect(secureMessaging.paginationMetaByFolderId?.[folderID]).toEqual({
        ...mockMeta.pagination,
        totalPages: 0, // value gets mocked
      })
      expect(secureMessaging.loadedMessagesByFolderId?.[folderID]).toEqual(mockMessages)
    })

    it('should return error if it fails', async () => {
      const error = new Error('backend error')
      const folderID = SecureMessagingSystemFolderIdConstants.SENT
      when(api.get as jest.Mock)
          .calledWith(`/v0/messaging/health/folders/${folderID}/messages`, { 'per_page': DEFAULT_PAGE_SIZE.toString(), 'page': '1'})
          .mockRejectedValue(error)

      const store = realStore()
      await store.dispatch(listFolderMessages(folderID, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))

      const actions = store.getActions()
      const startAction = _.find(actions, { type: 'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES' })
      expect(startAction).toBeTruthy()

      const endAction = _.find(actions, { type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES' })
      expect(endAction).toBeTruthy()

      const { secureMessaging } = store.getState()
      expect(secureMessaging.error).toEqual(error)
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
})
