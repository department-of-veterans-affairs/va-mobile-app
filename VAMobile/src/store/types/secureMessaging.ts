import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES action
 */
export type SecureMessagingStartFetchInboxMessagesPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES action
 */
export type SecureMessagingFinishFetchInboxMessagesPayload = {
  inboxMessages?: api.SecureMessagingFolderMessagesGetData
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_START_LIST_FOLDERS action
 */
export type SecureMessagingStartListFoldersPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_LIST_FOLDERS action
 */
export type SecureMessagingFinishListFoldersPayload = {
  folderData?: api.SecureMessagingFoldersGetData
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES action
 */
export type SecureMessagingStartListFolderMessagesPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES action
 */
export type SecureMessagingFinishListFolderMessagesPayload = {
  messageData?: api.SecureMessagingFolderMessagesGetData
  folderID: number
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_START_GET_INBOX action
 */
export type SecureMessagingStartGetInboxPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_GET_INBOX action
 */
export type SecureMessagingFinishGetInboxPayload = {
  inboxData?: api.SecureMessagingFolderGetData
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_START_GET_MESSAGE action
 */
export type SecureMessagingStartGetMessagePayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_GET_MESSAGE action
 */
export type SecureMessagingFinishGetMessagePayload = {
  messageData?: api.SecureMessagingMessageGetData
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_START_GET_THREAD action
 */
export type SecureMessagingStartGetThreadPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_GET_THREAD action
 */
export type SecureMessagingFinishGetThreadPayload = {
  threadData?: api.SecureMessagingThreadGetData
  messageID?: number
  error?: Error
}

/**
 * Redux payload for SECURE_MESSAGING_UPDATE_TAB action
 */
export type SecureMessagingUpdateTab = {
  secureMessagingTab: api.SecureMessagingTabTypes
}

/**
 * Redux payload for the SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT action
 */
export type SecureMessagingStartDownloadAttachment = {
  fileKey?: string
}

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT action
 */
export type SecureMessagingFinishDownloadAttachment = {
  error?: Error
}

/**
 * Redux payload for the SECURE_MESSAGING_START_GET_RECIPIENTS action
 */
export type SecureMessagingStartGetRecipients = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_GET_RECIPIENTS action
 */
export type SecureMessagingFinishGetRecipients = {
  recipients?: api.SecureMessagingRecipientDataList
  error?: Error
}

/**
 * Redux payload for the SECURE_MESSAGING_START_SEND_MESSAGE action
 */
export type SecureMessagingStartSendMessage = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_SEND_MESSAGE action
 */
export type SecureMessagingFinishSendMessage = {
  error?: Error
}

/**
 * Redux payload for the SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE action
 */
export type SecureMessagingResetSendMessageComplete = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED action
 */
export type SecureMessagingResetSendMessageFailed = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_CLEAR_LOADED_MESSAGES action
 */
export type SecureMessagingClearLoadedMessagesPayload = Record<string, unknown>

/**
 *  All secure messaging actions
 */
export interface SecureMessagingActions {
  /** Redux action to signify that the fetch inbox messages request has started */
  SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_START_FETCH_INBOX_MESSAGES', SecureMessagingStartFetchInboxMessagesPayload>
  /** Redux action to signify that the fetch inbox messages request has finished */
  SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_FINISH_FETCH_INBOX_MESSAGES', SecureMessagingFinishFetchInboxMessagesPayload>
  /** Redux action to signify that the list folders request has started */
  SECURE_MESSAGING_START_LIST_FOLDERS: ActionDef<'SECURE_MESSAGING_START_LIST_FOLDERS', SecureMessagingStartListFoldersPayload>
  /** Redux action to signify that the list folders request has finished */
  SECURE_MESSAGING_FINISH_LIST_FOLDERS: ActionDef<'SECURE_MESSAGING_FINISH_LIST_FOLDERS', SecureMessagingFinishListFoldersPayload>
  /** Redux action to signify that the list messages request has started */
  SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES: ActionDef<'SECURE_MESSAGING_START_LIST_FOLDER_MESSAGES', SecureMessagingStartListFolderMessagesPayload>
  /** Redux action to signify that the list messages request has finished */
  SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES: ActionDef<'SECURE_MESSAGING_FINISH_LIST_FOLDER_MESSAGES', SecureMessagingFinishListFolderMessagesPayload>
  /** Redux action to signify that the list folders request has started */
  SECURE_MESSAGING_START_GET_INBOX: ActionDef<'SECURE_MESSAGING_START_GET_INBOX', SecureMessagingStartGetInboxPayload>
  /** Redux action to signify that the list folders request has finished */
  SECURE_MESSAGING_FINISH_GET_INBOX: ActionDef<'SECURE_MESSAGING_FINISH_GET_INBOX', SecureMessagingFinishGetInboxPayload>
  /** Redux action to signify that the get message and thread request has started */
  SECURE_MESSAGING_START_GET_MESSAGE: ActionDef<'SECURE_MESSAGING_START_GET_MESSAGE', SecureMessagingStartGetMessagePayload>
  /** Redux action to signify that get message and threadrequest has finished */
  SECURE_MESSAGING_FINISH_GET_MESSAGE: ActionDef<'SECURE_MESSAGING_FINISH_GET_MESSAGE', SecureMessagingFinishGetMessagePayload>
  /** Redux action to signify that the get message and thread request has started */
  SECURE_MESSAGING_START_GET_ATTACHMENT_LIST: ActionDef<'SECURE_MESSAGING_START_GET_ATTACHMENT_LIST', SecureMessagingStartGetMessagePayload>
  /** Redux action to signify that the get message and thread request has started */
  SECURE_MESSAGING_START_GET_THREAD: ActionDef<'SECURE_MESSAGING_START_GET_THREAD', SecureMessagingStartGetThreadPayload>
  /** Redux action to signify that get message and threadrequest has finished */
  SECURE_MESSAGING_FINISH_GET_THREAD: ActionDef<'SECURE_MESSAGING_FINISH_GET_THREAD', SecureMessagingFinishGetThreadPayload>
  /** Redux action to signify updating the current secure messaging tab */
  SECURE_MESSAGING_UPDATE_TAB: ActionDef<'SECURE_MESSAGING_UPDATE_TAB', SecureMessagingUpdateTab>
  /** Redux action when starting the action to download an attachment file */
  SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT: ActionDef<'SECURE_MESSAGING_START_DOWNLOAD_ATTACHMENT', SecureMessagingStartDownloadAttachment>
  /** Redux action when finishing the action to download an attachment file*/
  SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT: ActionDef<'SECURE_MESSAGING_FINISH_DOWNLOAD_ATTACHMENT', SecureMessagingFinishDownloadAttachment>
  /** Redux action when starting the action to get message recipients */
  SECURE_MESSAGING_START_GET_RECIPIENTS: ActionDef<'SECURE_MESSAGING_START_GET_RECIPIENTS', SecureMessagingStartGetRecipients>
  /** Redux action when finishing the action to get message recipients */
  SECURE_MESSAGING_FINISH_GET_RECIPIENTS: ActionDef<'SECURE_MESSAGING_FINISH_GET_RECIPIENTS', SecureMessagingFinishGetRecipients>
  /** Redux action when starting the action to send a new message */
  SECURE_MESSAGING_START_SEND_MESSAGE: ActionDef<'SECURE_MESSAGING_START_SEND_MESSAGE', SecureMessagingStartSendMessage>
  /** Redux action when finishing the action to send a new message */
  SECURE_MESSAGING_FINISH_SEND_MESSAGE: ActionDef<'SECURE_MESSAGING_FINISH_SEND_MESSAGE', SecureMessagingFinishSendMessage>
  /** Redux action when resetting sendMessageComplete attribute in store to false */
  SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE: ActionDef<'SECURE_MESSAGING_RESET_SEND_MESSAGE_COMPLETE', SecureMessagingResetSendMessageComplete>
  /** Redux action when resetting sendMessageFailed attribute in store to false */
  SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED: ActionDef<'SECURE_MESSAGING_RESET_SEND_MESSAGE_FAILED', SecureMessagingResetSendMessageFailed>
  /** Redux action to signify clearing loaded messages from the store */
  SECURE_MESSAGING_CLEAR_LOADED_MESSAGES: ActionDef<'SECURE_MESSAGING_CLEAR_LOADED_MESSAGES', SecureMessagingClearLoadedMessagesPayload>
}
