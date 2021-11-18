import { DemoStore } from './store'
import { Params } from '../api'
import { SecureMessagingFolderGetData, SecureMessagingFolderMessagesGetData, SecureMessagingFoldersGetData } from '../types'

type MessagePageNumber = '1' | '2'

/**
 * Type denoting the demo data store for secure messaging
 */
// TODO replace 0 with SecureMessagingSystemFolderIdConstants.INDEX?
export type SecureMessagingDemoStore = {
  '/v0/messaging/health/folders': SecureMessagingFoldersGetData
  '/v0/messaging/health/folders/0': SecureMessagingFolderGetData
  '/v0/messaging/health/folders/0/messages': {
    '1': SecureMessagingFolderMessagesGetData
    '2': SecureMessagingFolderMessagesGetData
  }
}

/**
 * Type to define the mock returns to keep type safety
 */
export type SecureMessagingDemoApiReturnTypes = SecureMessagingFolderGetData | SecureMessagingFolderMessagesGetData

export const getInboxMessage = (store: DemoStore, params: Params): SecureMessagingFolderMessagesGetData => {
  const { page } = params
  return store['/v0/messaging/health/folders/0/messages'][page as MessagePageNumber]
}
