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
  inboxMessages?: api.SecureMessagesListData
  error?: Error
}

/**
 *  All appointments actions
 */
export interface SecureMessagingActions {
  /** Redux action to signify that the prefetch appointments request has started */
  SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_START_PREFETCH_INBOX_MESSAGES', SecureMessagingStartPrefetchInboxMessagesPayload>
  /** Redux action to signify that the prefetch appointments request has finished */
  SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES: ActionDef<'SECURE_MESSAGING_FINISH_PREFETCH_INBOX_MESSAGES', SecureMessagingFinishPrefetchInboxMessagesPayload>
}
