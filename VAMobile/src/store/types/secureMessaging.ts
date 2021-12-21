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
  error?: api.APIError
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
  error?: api.APIError
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
  error?: api.APIError
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
  error?: api.APIError
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
  error?: api.APIError
  messageId?: number
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
  error?: api.APIError
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
  recipients: api.SecureMessagingRecipientDataList
  error?: api.APIError
}

/**
 * Redux payload for the SECURE_MESSAGING_START_GET_SIGNATURE action
 */
export type SecureMessagingStartGetSignature = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_GET_SIGNATURE action
 */
export type SecureMessagingFinishGetSignature = {
  signature?: api.SecureMessagingSignatureDataAttributes
  error?: api.APIError
}

/**
 * Redux payload for the SECURE_MESSAGING_START_SAVE_DRAFT action
 */
export type SecureMessagingStartSaveDraft = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_SAVE_DRAFT action
 */
export type SecureMessagingFinishSaveDraft = {
  messageID?: number
  error?: api.APIError
}

/**
 * Redux payload for the SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE action
 */
export type SecureMessagingResetSaveDraftComplete = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED action
 */
export type SecureMessagingResetSaveDraftFailed = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_START_SEND_MESSAGE action
 */
export type SecureMessagingStartSendMessage = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_SEND_MESSAGE action
 */
export type SecureMessagingFinishSendMessage = {
  error?: api.APIError
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
 * Redux payload for the SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR action
 */
export type SecureMessagingResetReplyTriageError = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_RESET_LOADING_RECIPIENTS_COMPLETED action
 */
export type SecureMessagingResetHasLoadedRecipients = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_START_MOVE_MESSAGE action
 */
export type SecureMessagingStartMoveMessage = { isUndo?: boolean }

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_MOVE_MESSAGE action
 */
export type SecureMessagingFinishMoveMessage = {
  isUndo?: boolean
  error?: api.APIError
}

export type SecureMessagingStartDeleteDraft = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_FINISH_MOVE_MESSAGE action
 */
export type SecureMessagingFinishDeleteDraft = {
  error?: api.APIError
}

/**
 * Redux payload for the SECURE_MESSAGING_RESET_DELETE_DRAFT_COMPLETE action
 */
export type SecureMessagingResetDeleteDraftComplete = Record<string, unknown>

/**
 * Redux payload for the SECURE_MESSAGING_RESET_DELETE_DRAFT_FAILED action
 */
export type SecureMessagingResetDeleteDraftFailed = Record<string, unknown>

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
  /** Redux action when starting the action to save a draft */
  SECURE_MESSAGING_START_SAVE_DRAFT: ActionDef<'SECURE_MESSAGING_START_SAVE_DRAFT', SecureMessagingStartSaveDraft>
  /** Redux action when finishing the action to save a draft */
  SECURE_MESSAGING_FINISH_SAVE_DRAFT: ActionDef<'SECURE_MESSAGING_FINISH_SAVE_DRAFT', SecureMessagingFinishSaveDraft>
  /** Redux action when resetting saveDraftComplete attribute in store to false */
  SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE: ActionDef<'SECURE_MESSAGING_RESET_SAVE_DRAFT_COMPLETE', SecureMessagingResetSaveDraftComplete>
  /** Redux action when resetting saveDraftFailed attribute in store to false */
  SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED: ActionDef<'SECURE_MESSAGING_RESET_SAVE_DRAFT_FAILED', SecureMessagingResetSaveDraftFailed>
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
  SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR: ActionDef<'SECURE_MESSAGING_RESET_REPLY_TRIAGE_ERROR', SecureMessagingResetReplyTriageError>
  SECURE_MESSAGING_RESET_HAS_LOADED_RECIPIENTS: ActionDef<'SECURE_MESSAGING_RESET_HAS_LOADED_RECIPIENTS', SecureMessagingResetHasLoadedRecipients>
  SECURE_MESSAGING_FINISH_GET_SIGNATURE: ActionDef<'SECURE_MESSAGING_FINISH_GET_SIGNATURE', SecureMessagingFinishGetSignature>
  SECURE_MESSAGING_START_GET_SIGNATURE: ActionDef<'SECURE_MESSAGING_START_GET_SIGNATURE', SecureMessagingStartGetSignature>
  SECURE_MESSAGING_START_MOVE_MESSAGE: ActionDef<'SECURE_MESSAGING_START_MOVE_MESSAGE', SecureMessagingStartMoveMessage>
  SECURE_MESSAGING_FINISH_MOVE_MESSAGE: ActionDef<'SECURE_MESSAGING_FINISH_MOVE_MESSAGE', SecureMessagingFinishMoveMessage>
  SECURE_MESSAGING_START_DELETE_DRAFT: ActionDef<'SECURE_MESSAGING_START_DELETE_DRAFT', SecureMessagingStartDeleteDraft>
  SECURE_MESSAGING_FINISH_DELETE_DRAFT: ActionDef<'SECURE_MESSAGING_FINISH_DELETE_DRAFT', SecureMessagingFinishDeleteDraft>
  SECURE_MESSAGING_RESET_DELETE_DRAFT_COMPLETE: ActionDef<'SECURE_MESSAGING_RESET_DELETE_DRAFT_COMPLETE', SecureMessagingResetDeleteDraftComplete>
  SECURE_MESSAGING_RESET_DELETE_DRAFT_FAILED: ActionDef<'SECURE_MESSAGING_RESET_DELETE_DRAFT_FAILED', SecureMessagingResetDeleteDraftFailed>
}
