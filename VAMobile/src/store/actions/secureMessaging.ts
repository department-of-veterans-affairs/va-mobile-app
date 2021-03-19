import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import {
  ScreenIDTypes,
  SecureMessagingFolderGetData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageGetData,
  SecureMessagingThreadGetData,
} from 'store/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getCommonErrorFromAPIError } from 'utils/errors'

const dispatchStartPrefetchInboxMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES',
    payload: {},
  }
}

const dispatchFinishPrefetchInboxMessages = (inboxMessages?: SecureMessagingFolderMessagesGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES',
    payload: {
      inboxMessages,
      error,
    },
  }
}

/**
 * Redux action to prefetch inbox messages
 * TODO should this just be a generic prefetchMessages?
 */
export const prefetchInboxMessages = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(prefetchInboxMessages(screenID))))
    dispatch(dispatchStartPrefetchInboxMessages())

    try {
      const inboxMessages = await api.get<SecureMessagingFolderMessagesGetData>('/v0/messaging/health/folders/0/messages')
      dispatch(dispatchFinishPrefetchInboxMessages(inboxMessages, undefined))
    } catch (error) {
      dispatch(dispatchFinishPrefetchInboxMessages(undefined, error))
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
      const inbox = await api.get<SecureMessagingFolderGetData>('/v0/messaging/health/folders/0')

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

const dispatchFinishListFolderMessages = (folderID: string, messageData?: SecureMessagingFolderMessagesGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES',
    payload: {
      messageData,
      folderID,
      error,
    },
  }
}

export const listFolderMessages = (folderID: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolderMessages(folderID, screenID))))
    dispatch(dispatchStartListFolderMessages())

    try {
      const messages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`)
      dispatch(dispatchFinishListFolderMessages(folderID, messages, undefined))
    } catch (error) {
      console.error(error)
      dispatch(dispatchFinishListFolderMessages('', undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetMessageThread = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_MESSAGE_THREAD',
    payload: {},
  }
}

const dispatchFinishGetMessageThread = (messageData?: SecureMessagingMessageGetData, threadData?: SecureMessagingThreadGetData, error?: Error): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE_THREAD',
    payload: {
      messageData,
      threadData,
      error,
    },
  }
}

export const getMessageThread = (messageID: string, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors())
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessageThread(messageID))))
    dispatch(dispatchStartGetMessageThread())

    try {
      const prefix = '/v0/messaging/health/messages'
      const response = await Promise.all([api.get<SecureMessagingMessageGetData>(`${prefix}/${messageID}`), api.get<SecureMessagingThreadGetData>(`${prefix}/${messageID}/thread`)])
      dispatch(dispatchFinishGetMessageThread(response[0], response[1]))
    } catch (error) {
      console.error(error)
      dispatch(dispatchFinishGetMessageThread(undefined, undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}
