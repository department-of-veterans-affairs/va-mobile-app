import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { DEFAULT_PAGE_SIZE } from 'constants/common'
import {
  Params,
  ScreenIDTypes,
  SecureMessagingAttachment,
  SecureMessagingFolderGetData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageGetData,
  SecureMessagingRecipientDataList,
  SecureMessagingRecipients,
  SecureMessagingTabTypes,
  SecureMessagingThreadGetData,
} from 'store/api'
import { SecureMessagingMessageMap } from '../api'
import { SecureMessagingState } from '../reducers'
import { SecureMessagingSystemFolderIdConstants } from 'store/api/types/SecureMessagingData'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { downloadFile } from 'utils/filesystem'
import { getCommonErrorFromAPIError } from 'utils/errors'
import FileViewer from 'react-native-file-viewer'

const dispatchStartFetchInboxMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES',
    payload: {},
  }
}

const dispatchFinishFetchInboxMessages = (inboxMessages?: SecureMessagingFolderMessagesGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES',
    payload: {
      inboxMessages,
      error,
    },
  }
}

// converts a list of messageIds to a list of messages(SecureMessagingMessageList)
const convertIdsToMessages = (messagesIds: Array<string>, messagesById?: SecureMessagingMessageMap) => {
  return messagesIds
    .map((mID) => {
      if (messagesById?.[mID]) {
        return {
          type: 'messages',
          id: mID,
          attributes: messagesById?.[mID],
        }
      }
    })
    .filter((m) => !!m)
}

// Return data that looks like SecureMessagingFolderMessagesGetData if data was loaded previously otherwise null
const getLoadedMessages = (state: SecureMessagingState, folderID: number, latestPage: number, pageSize: number) => {
  const { loadedMessageIdsByFolderId, paginationMetaByFolderId, messagesById } = state
  // Grab the messagesIds for that folder
  const messagesIds = loadedMessageIdsByFolderId?.[folderID] || []
  const totalEntries = paginationMetaByFolderId?.[folderID]?.totalEntries || 0

  // get begin and end index to check if we have the items already and for slicing
  const beginIdx = (latestPage - 1) * pageSize
  const endIdx = latestPage * pageSize

  // do we have the messages?
  if (beginIdx < messagesIds.length) {
    const messageIdsForPage = messagesIds.slice(beginIdx, endIdx)
    // Take the messageIds and create an array of messages using messagesById
    const messages = convertIdsToMessages(messageIdsForPage, messagesById)

    return {
      data: messages,
      links: {
        self: '',
        first: '',
        prev: '',
        next: '',
        last: '',
      },
      meta: {
        sort: {
          sentDate: '',
        },
        pagination: {
          totalPages: 0,
          currentPage: latestPage,
          perPage: pageSize,
          totalEntries: totalEntries,
        },
        dataFromStore: true, // informs reducer not to save these messages to the store
      },
    } as SecureMessagingFolderMessagesGetData
  }
  return null
}

/**
 * Redux action to fetch inbox messages
 */
export const fetchInboxMessages = (page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(fetchInboxMessages(page, screenID))))
    dispatch(dispatchStartFetchInboxMessages())

    // Use loaded messages if available for sent
    const inboxFolderID = SecureMessagingSystemFolderIdConstants.INBOX
    const { secureMessaging } = getState()
    const loadedMessages = getLoadedMessages(secureMessaging, inboxFolderID, page, DEFAULT_PAGE_SIZE)
    // TODO are we worried about stale data if we keep loading data we already have? ex. a new message comes in
    if (loadedMessages) {
      dispatch(dispatchFinishFetchInboxMessages(loadedMessages, undefined))
      return
    }

    try {
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inboxMessages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
        ['per_page']: DEFAULT_PAGE_SIZE.toString(),
      } as Params)
      dispatch(dispatchFinishFetchInboxMessages(inboxMessages, undefined))
    } catch (error) {
      dispatch(dispatchFinishFetchInboxMessages(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartListFolders = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_LIST_FOLDERS',
    payload: {},
  }
}

const dispatchFinishListFolders = (folderData?: SecureMessagingFoldersGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_LIST_FOLDERS',
    payload: {
      folderData,
      error,
    },
  }
}

export const listFolders = (screenID?: ScreenIDTypes, forceRefresh = false): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolders(screenID))))
    dispatch(dispatchStartListFolders())

    try {
      let folders
      const currentStateFolders = _getState().secureMessaging?.folders

      // Since users can't manage folders from within the app, they are unlikely to change
      // within a session.  Prevents multiple fetch calls for folders unless forceRefresh = true
      if (!currentStateFolders?.length || forceRefresh) {
        folders = await api.get<SecureMessagingFoldersGetData>('/v0/messaging/health/folders')
      }

      dispatch(dispatchFinishListFolders(folders, undefined))
    } catch (error) {
      dispatch(dispatchFinishListFolders(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetInbox = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_INBOX',
    payload: {},
  }
}

const dispatchFinishGetInbox = (inboxData?: SecureMessagingFolderGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_INBOX',
    payload: {
      inboxData,
      error,
    },
  }
}

export const getInbox = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getInbox(screenID))))
    dispatch(dispatchStartGetInbox())

    try {
      //TODO what is the right refersh logic to ensure we don't invoke the API too frequently
      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inbox = await api.get<SecureMessagingFolderGetData>(`/v0/messaging/health/folders/${folderID}`)

      dispatch(dispatchFinishGetInbox(inbox, undefined))
    } catch (error) {
      dispatch(dispatchFinishGetInbox(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartListFolderMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES',
    payload: {},
  }
}

const dispatchFinishListFolderMessages = (folderID: number, messageData?: SecureMessagingFolderMessagesGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES',
    payload: {
      messageData,
      folderID,
      error,
    },
  }
}

export const listFolderMessages = (folderID: number, page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolderMessages(folderID, page, screenID))))
    dispatch(dispatchStartListFolderMessages())

    // Use loaded messages if available for sent
    const sentFolderID = SecureMessagingSystemFolderIdConstants.SENT
    if (folderID === sentFolderID) {
      const { secureMessaging } = getState()
      const loadedMessages = getLoadedMessages(secureMessaging, folderID, page, DEFAULT_PAGE_SIZE)
      // TODO are we worried about stale data if we keep loading data we already have? ex. a new message comes in
      if (loadedMessages) {
        dispatch(dispatchFinishListFolderMessages(folderID, loadedMessages, undefined))
        return
      }
    }

    try {
      const messages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
        ['per_page']: DEFAULT_PAGE_SIZE.toString(),
      } as Params)
      dispatch(dispatchFinishListFolderMessages(folderID, messages, undefined))
    } catch (error) {
      dispatch(dispatchFinishListFolderMessages(folderID, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetThread = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_THREAD',
    payload: {},
  }
}

const dispatchFinishGetThread = (threadData?: SecureMessagingThreadGetData, messageID?: number, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_THREAD',
    payload: {
      threadData,
      messageID,
      error,
    },
  }
}

export const getThread = (messageID: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getThread(messageID))))
    dispatch(dispatchStartGetThread())

    try {
      const response = await api.get<SecureMessagingThreadGetData>(`/v0/messaging/health/messages/${messageID}/thread`)
      dispatch(dispatchFinishGetThread(response, messageID))
    } catch (error) {
      dispatch(dispatchFinishGetThread(undefined, messageID, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetMessage = (): ReduxAction => ({
  type: 'SECURE_MESSAGING_START_GET_MESSAGE',
  payload: {},
})

const dispatchFinishGetMessage = (messageData?: SecureMessagingMessageGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE',
    payload: {
      messageData,
      error,
    },
  }
}

const dispatchStartGetAttachmentList = (): ReduxAction => ({
  type: 'SECURE_MESSAGING_START_GET_ATTACHMENT_LIST',
  payload: {},
})

/**  */
export const getMessage = (
  /** ID of the message we want to fetch */
  messageID: number,
  screenID?: ScreenIDTypes,
  /** Forces an API call.  By default we check the messages map before doing a fetch, but sometimes
   *  we need to refresh or might have only a summary in the map, which doesn't contain attachment info
   */
  force = false,
  /** Set to true if we want to display the inline activity indicator instead of of the one that takes up the whole screen */
  loadingAttachments = false,
): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessage(messageID))))

    if (loadingAttachments) {
      dispatch(dispatchStartGetAttachmentList())
    } else {
      dispatch(dispatchStartGetMessage())
    }

    try {
      const { messagesById } = _getState().secureMessaging
      let response
      if (!messagesById?.[messageID] || force) {
        response = await api.get<SecureMessagingMessageGetData>(`/v0/messaging/health/messages/${messageID}`)
      }

      dispatch(dispatchFinishGetMessage(response))
    } catch (error) {
      dispatch(dispatchFinishGetMessage(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchUpdateSecureMessagingTab = (secureMessagingTab: SecureMessagingTabTypes): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_UPDATE_TAB',
    payload: {
      secureMessagingTab,
    },
  }
}

/**
 * Redux action to update the secure messaging tab
 */
export const updateSecureMessagingTab = (secureMessagingTab: SecureMessagingTabTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateSecureMessagingTab(secureMessagingTab))
  }
}

const dispatchStartDownloadFileAttachment = (fileKey: string): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT',
    payload: {
      fileKey,
    },
  }
}

const dispatchFinishDownloadFileAttachment = (error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to download a file attachment
 */
export const downloadFileAttachment = (file: SecureMessagingAttachment, fileKey: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartDownloadFileAttachment(fileKey))

    try {
      const filePath = await downloadFile('GET', file.link, file.filename)
      dispatch(dispatchFinishDownloadFileAttachment())

      if (filePath) {
        await FileViewer.open(filePath)
      }
    } catch (error) {
      /** All download errors will be caught here so there is no special path
       *  for network connection errors
       */
      dispatch(dispatchFinishDownloadFileAttachment(error))
    }
  }
}

const dispatchStartGetMessageRecipients = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_RECIPIENTS',
    payload: {},
  }
}

const dispatchFinishGetMessageRecipients = (recipients?: SecureMessagingRecipientDataList, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_RECIPIENTS',
    payload: {
      recipients,
      error,
    },
  }
}

/**
 * Redux action to get all possible recipients of a message
 */
export const getMessageRecipients = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageRecipients(screenID))))
    dispatch(dispatchStartGetMessageRecipients())

    try {
      const recipientsData = await api.get<SecureMessagingRecipients>('/v0/messaging/health/recipients')
      dispatch(dispatchFinishGetMessageRecipients(recipientsData?.data))
    } catch (error) {
      dispatch(dispatchFinishGetMessageRecipients(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}
