import * as api from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { DocumentPickerResponse } from 'screens/ClaimsScreen/ClaimsStackScreens'
import { Events, UserAnalytics } from 'constants/analytics'
import { ImagePickerResponse } from 'react-native-image-picker/src/types'
import { READ } from 'constants/secureMessaging'
import { ScreenIDTypesConstants, SecureMessagingFormData } from 'store/api/types'

import {
  Params,
  ScreenIDTypes,
  SecureMessagingAttachment,
  SecureMessagingFolderGetData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageData,
  SecureMessagingMessageGetData,
  SecureMessagingRecipientDataList,
  SecureMessagingRecipients,
  SecureMessagingSaveDraftData,
  SecureMessagingSystemFolderIdConstants,
  SecureMessagingTabTypes,
  SecureMessagingThreadGetData,
} from 'store/api'
import { SecureMessagingErrorCodesConstants } from 'constants/errors'
import { contentTypes } from 'store/api/api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { downloadFile, unlinkFile } from 'utils/filesystem'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'
import FileViewer from 'react-native-file-viewer'

const dispatchStartFetchInboxMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES',
    payload: {},
  }
}

const dispatchFinishFetchInboxMessages = (inboxMessages?: SecureMessagingFolderMessagesGetData, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES',
    payload: {
      inboxMessages,
      error,
    },
  }
}

/**
 * Redux action to fetch inbox messages
 */
export const fetchInboxMessages = (page: number, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(fetchInboxMessages(page, screenID))))
    dispatch(dispatchStartFetchInboxMessages())

    try {
      // TODO story #25035, remove once ready
      const signInEmail = getState()?.personalInformation?.profile?.signinEmail || ''
      if (signInEmail === 'vets.gov.user+1414@gmail.com') {
        throw {
          json: {
            errors: [
              {
                code: SecureMessagingErrorCodesConstants.TERMS_AND_CONDITIONS,
              },
            ],
          },
        }
      }

      const folderID = SecureMessagingSystemFolderIdConstants.INBOX
      const inboxMessages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
      } as Params)
      dispatch(dispatchFinishFetchInboxMessages(inboxMessages, undefined))
      dispatch(getInbox())
    } catch (error) {
      dispatch(dispatchFinishFetchInboxMessages(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error, screenID), screenID))
    }
  }
}

const dispatchStartListFolders = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_LIST_FOLDERS',
    payload: {},
  }
}

const dispatchFinishListFolders = (folderData?: SecureMessagingFoldersGetData, error?: api.APIError): ReduxAction => {
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
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolders(screenID))))
    dispatch(dispatchStartListFolders())

    try {
      let folders
      const currentStateFolders = _getState().secureMessaging?.folders

      // Since users can't manage folders from within the app, they are unlikely to change
      // within a session.  Prevents multiple fetch calls for folders unless forceRefresh = true
      if (!currentStateFolders?.length || forceRefresh) {
        folders = await api.get<SecureMessagingFoldersGetData>('/v0/messaging/health/folders', { useCache: String(!forceRefresh) })
      }
      dispatch(dispatchFinishListFolders(folders, undefined))
    } catch (error) {
      dispatch(dispatchFinishListFolders(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error, screenID), screenID))
    }
  }
}

const dispatchStartGetInbox = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_GET_INBOX',
    payload: {},
  }
}

const dispatchFinishGetInbox = (inboxData?: SecureMessagingFolderGetData, error?: api.APIError): ReduxAction => {
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
    dispatch(dispatchClearErrors(screenID))
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

const dispatchFinishListFolderMessages = (folderID: number, messageData?: SecureMessagingFolderMessagesGetData, error?: api.APIError): ReduxAction => {
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
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(listFolderMessages(folderID, page, screenID))))
    dispatch(dispatchStartListFolderMessages())

    try {
      const messages = await api.get<SecureMessagingFolderMessagesGetData>(`/v0/messaging/health/folders/${folderID}/messages`, {
        page: page.toString(),
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

const dispatchFinishGetThread = (threadData?: SecureMessagingThreadGetData, messageID?: number, error?: api.APIError): ReduxAction => {
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
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getThread(messageID))))
    dispatch(dispatchStartGetThread())

    try {
      const response = await api.get<SecureMessagingThreadGetData>(`/v0/messaging/health/messages/${messageID}/thread`)
      dispatch(dispatchFinishGetThread(response, messageID))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_secure_messaging())
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

const dispatchFinishGetMessage = (messageData?: SecureMessagingMessageGetData, error?: api.APIError, messageId?: number): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_GET_MESSAGE',
    payload: {
      messageData,
      error,
      messageId,
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
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getMessage(messageID))))

    if (loadingAttachments) {
      dispatch(dispatchStartGetAttachmentList())
    } else {
      dispatch(dispatchStartGetMessage())
    }

    try {
      const { messagesById } = _getState().secureMessaging
      let response
      // If no message contents, then this messageID was added during fetch folder/inbox message call and does not contain the full info yet
      // Message content of some kind is required on the reply/compose forms.
      if (!messagesById?.[messageID] || (messagesById?.[messageID] && !messagesById[messageID].body && !messagesById[messageID].attachments) || force) {
        response = await api.get<SecureMessagingMessageGetData>(`/v0/messaging/health/messages/${messageID}`)
      }

      // If message is unread, refresh inbox to get up to date unreadCount
      if (messagesById?.[messageID] && messagesById[messageID].readReceipt !== READ) {
        dispatch(getInbox())
      }
      dispatch(dispatchFinishGetMessage(response))
    } catch (error) {
      dispatch(dispatchFinishGetMessage(undefined, error, messageID))
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
        await FileViewer.open(filePath, {
          onDismiss: async (): Promise<void> => {
            await unlinkFile(filePath)
          },
        })
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

const dispatchFinishGetMessageRecipients = (recipients?: SecureMessagingRecipientDataList, error?: api.APIError): ReduxAction => {
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
    dispatch(dispatchClearErrors(screenID))
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

const dispatchStartSaveDraft = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_SAVE_DRAFT',
    payload: {},
  }
}

const dispatchFinishSaveDraft = (messageID?: number, error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_SAVE_DRAFT',
    payload: {
      messageID,
      error,
    },
  }
}

export const resetSaveDraftComplete = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE',
    payload: {},
  }
}

/**
 * Redux action to reset saveDraftFailed attribute to false
 */
export const resetSaveDraftFailed = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED',
    payload: {},
  }
}

/**
 * Redux action to save a message draft - If a messageID is included, perform a PUT to
 * update an existing draft instead.  If the draft is a reply, call reply-specific endpoints
 */
export const saveDraft = (messageData: SecureMessagingFormData, messageID?: number, isReply?: boolean, replyID?: number, refreshFolder?: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchSetTryAgainFunction(() => dispatch(saveDraft(messageData))))
    dispatch(dispatchStartSaveDraft())
    try {
      let response
      if (messageID) {
        const url = isReply ? `/v0/messaging/health/message_drafts/${replyID}/replydraft/${messageID}` : `/v0/messaging/health/message_drafts/${messageID}`
        response = await api.put<SecureMessagingSaveDraftData>(url, (messageData as unknown) as api.Params)
      } else {
        const url = isReply ? `/v0/messaging/health/message_drafts/${replyID}/replydraft` : '/v0/messaging/health/message_drafts'
        response = await api.post<SecureMessagingSaveDraftData>(url, (messageData as unknown) as api.Params)
      }
      const [totalTime, actionTime] = getAnalyticsTimers(_getState())
      await logAnalyticsEvent(Events.vama_sm_save_draft(totalTime, actionTime))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_secure_messaging())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveDraft(Number(response?.data?.id)))

      if (refreshFolder) {
        dispatch(listFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, 1, ScreenIDTypesConstants.SECURE_MESSAGING_FOLDER_MESSAGES_SCREEN_ID))
      }
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
    } catch (error) {
      dispatch(dispatchFinishSaveDraft(undefined, error))
    }
  }
}

const dispatchStartSendMessage = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_START_SEND_MESSAGE',
    payload: {},
  }
}

const dispatchFinishSendMessage = (error?: api.APIError): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_FINISH_SEND_MESSAGE',
    payload: {
      error,
    },
  }
}

export const resetSendMessageComplete = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE',
    payload: {},
  }
}

/**
 * Redux action to reset sendMessageFailed attribute to false
 */
export const resetSendMessageFailed = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED',
    payload: {},
  }
}

/**
 * Redux action to send a new message - unnecessary to update the store because
 * the form flow will redirect you to the inbox after clicking "Send", which will
 * make an API call to get the latest contents anyway.
 */
export const sendMessage = (messageData: SecureMessagingFormData, uploads?: Array<ImagePickerResponse | DocumentPickerResponse>, replyToID?: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    let formData: FormData
    let postData
    if (uploads && uploads.length !== 0) {
      formData = new FormData()
      formData.append('message', JSON.stringify(messageData))

      uploads.forEach((attachment) => {
        // TODO: figure out why backend-upload reads images as 1 MB more than our displayed size (e.g. 1.15 MB --> 2.19 MB)
        formData.append('uploads[]', {
          name: (attachment as ImagePickerResponse).fileName || (attachment as DocumentPickerResponse).name || '',
          uri: attachment.uri || '',
          type: attachment.type || '',
        })
      })
      postData = formData
    } else {
      postData = messageData
    }
    dispatch(dispatchSetTryAgainFunction(() => dispatch(sendMessage(messageData, uploads))))
    dispatch(dispatchStartSendMessage()) //set loading to true
    try {
      await api.post<SecureMessagingMessageData>(
        replyToID ? `/v0/messaging/health/messages/${replyToID}/reply` : '/v0/messaging/health/messages',
        (postData as unknown) as api.Params,
        uploads && uploads.length !== 0 ? contentTypes.multipart : undefined,
      )

      const [totalTime, actionTime] = getAnalyticsTimers(_getState())
      await logAnalyticsEvent(Events.vama_sm_send_message(totalTime, actionTime))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_secure_messaging())
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(listFolders(ScreenIDTypesConstants.SECURE_MESSAGING_SCREEN_ID, true))
      dispatch(dispatchFinishSendMessage())
    } catch (error) {
      dispatch(dispatchFinishSendMessage(error))
    }
  }
}

export const dispatchClearLoadedMessages = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_CLEAR_LOADED_MESSAGES',
    payload: {},
  }
}

export const resetReplyTriageError = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR',
    payload: {},
  }
}

/**
 * Redux action to reset hasLoadedRecipients attribute to false
 */
export const resetHasLoadedRecipients = (): ReduxAction => {
  return {
    type: 'SECURE_MESSAGING_RESET_HAS_LOADED_RECIPIENTS',
    payload: {},
  }
}
