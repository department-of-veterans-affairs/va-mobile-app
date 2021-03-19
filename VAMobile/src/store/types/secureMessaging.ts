import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES action
 */
export type SecureMessagingStartPrefetchInboxMessagesPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES action
 */
export type SecureMessagingFinishPrefetchInboxMessagesPayload = {
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
  folderID: string
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
 * Redux payload for SECURE_MESSAGING_START_GET_INBOX action
 */
export type SecureMessagingStartGetMessageThreadPayload = Record<string, unknown>

/**
 * Redux payload for SECURE_MESSAGING_FINISH_GET_INBOX action
 */
export type SecureMessagingFinishGetMessageThreadPayload = {
  messageData?: api.SecureMessagingMessageGetData
  threadData?: api.SecureMessagingThreadGetData
  error?: Error
}

/**
 *  All secure messaging actions
 */
export interface SecureMessagingActions {
  /** Redux action to signify that the prefetch inbox messages request has started */
  SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES', SecureMessagingStartPrefetchInboxMessagesPayload>
  /** Redux action to signify that the prefetch inbox messages request has finished */
  SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES', SecureMessagingFinishPrefetchInboxMessagesPayload>
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
  SECURE_MESSAGING_START_GET_MESSAGE_THREAD: ActionDef<'SECURE_MESSAGING_START_GET_MESSAGE_THREAD', SecureMessagingStartGetMessageThreadPayload>
  /** Redux action to signify that get message and threadrequest has finished */
  SECURE_MESSAGING_FINISH_GET_MESSAGE_THREAD: ActionDef<'SECURE_MESSAGING_FINISH_GET_MESSAGE_THREAD', SecureMessagingFinishGetMessageThreadPayload>
}
