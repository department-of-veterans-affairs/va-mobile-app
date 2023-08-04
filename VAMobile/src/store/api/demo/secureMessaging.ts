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
 * Types for messages in inbox folder
 */
type inboxFolderMessages = {
  '/v0/messaging/health/messages/2092809': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2092809/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2092803': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2092803/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2092789': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2092789/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2092775': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2092775/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2088259': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2088259/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2088250': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2088250/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060125': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060125/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060114': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060114/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060047': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060047/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060025': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060025/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060013': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060013/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v0/messaging/health/messages/2060006': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2060006/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
}

/**
 * Types for messages in sent folder
 */
type sentFolderMessages = {
  '/v0/messaging/health/messages/2113100': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098942': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098929': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2098888': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2095016': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2113100/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2098942/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2098929/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2098888/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2095016/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
}

/**
 * Types for messages in draft folder
 */
type draftFolderMessages = {
  '/v0/messaging/health/messages/2113141': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2113020': SecureMessagingMessageGetData
  '/v0/messaging/health/messages/2092803': SecureMessagingMessageGetData
  '/v1/messaging/health/messages/2113141/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2113020/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '/v1/messaging/health/messages/2092803/thread?excludeProvidedMessage=true': SecureMessagingThreadGetData
  '"/v0/messaging/health/recipients"': SecureMessagingRecipientData
}

/**
 * Type denoting the demo data store for secure messaging
 */
export type SecureMessagingDemoStore = {
  '/v0/messaging/health/folders': SecureMessagingFoldersGetData
  '/v0/messaging/health/folders/0': SecureMessagingFolderGetData
  '/v0/messaging/health/folders/-1': SecureMessagingFolderGetData
  '/v0/messaging/health/folders/-2': SecureMessagingFolderGetData
} & folderMessages &
  inboxFolderMessages &
  sentFolderMessages &
  draftFolderMessages

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
