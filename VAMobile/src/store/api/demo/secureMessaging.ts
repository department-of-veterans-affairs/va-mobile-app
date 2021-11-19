import { DemoStore } from './store'
import { Params } from '../api'
import {
  SecureMessagingFolderGetData,
  SecureMessagingFolderMessagesGetData,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageGetData,
  SecureMessagingRecipientData,
  SecureMessagingThreadGetData,
} from '../types'

type MessagePageNumber = '1' | '2'

type folderMessages =
  | {
      '/v0/messaging/health/folders/0/messages': {
        '1': SecureMessagingFolderMessagesGetData
        '2': SecureMessagingFolderMessagesGetData
      }
    }
  | {
      '/v0/messaging/health/folders/-1/messages': {
        '1': SecureMessagingFolderMessagesGetData
      }
    }
  | {
      '/v0/messaging/health/folders/-2/messages': {
        '1': SecureMessagingFolderMessagesGetData
      }
    }

/**
 * Type denoting the demo data store for secure messaging
 */
export type SecureMessagingDemoStore = {
  '/v0/messaging/health/folders': SecureMessagingFoldersGetData
  '/v0/messaging/health/folders/0': SecureMessagingFolderGetData
  '/v0/messaging/health/folders/-1': SecureMessagingFolderGetData
  '/v0/messaging/health/folders/-2': SecureMessagingFolderGetData
  '/v0/messaging/health/messages/2113100': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098942': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098929': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098888': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2095016': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2113141': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2113020': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2092803': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2113100/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2098942/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2098929/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2098888/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2095016/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2113141/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2113020/thread': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2092803/thread': SecureMessagingThreadGetData
  '"/v0/messaging/health/recipients"': SecureMessagingRecipientData
} & folderMessages

/**
 * Type to define the mock returns to keep type safety
 */
export type SecureMessagingDemoApiReturnTypes =
  | SecureMessagingFolderGetData
  | SecureMessagingFolderMessagesGetData
  | SecureMessagingMessageGetData
  | SecureMessagingThreadGetData
  | SecureMessagingRecipientData

export const getFolderMessages = (store: DemoStore, params: Params, endpoint: string): SecureMessagingFolderMessagesGetData => {
  const { page } = params
  return store[endpoint as keyof folderMessages][page as MessagePageNumber] as SecureMessagingFolderMessagesGetData
}
