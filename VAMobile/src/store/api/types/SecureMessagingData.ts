/**
 * META
 */

export type SecureMessagingPaginationMeta = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
}

export type SecureMessagingMessagesSortMeta = {
  sentDate: string
}

/**
 * MESSAGES
 */

export type SecureMessagingMessageAttributes = {
  messageId: number
  category: string
  subject: string
  body?: string
  attachment: boolean
  attachments?: Array<SecureMessagingAttachment>
  sentDate: string
  senderId: number
  senderName: string
  recipientId: number
  recipientName: string
  readReceipt?: string
}

export type SecureMessagingAttachment = {
  id: string
  filename: string
  link: string
}

export type SecureMessagingMessageData = {
  type: string
  id: string
  attributes: SecureMessagingMessageAttributes
}

export type SecureMessagingMessageGetData = {
  data: SecureMessagingMessageList
}

export type SecureMessagingMessageList = Array<SecureMessagingMessageData>

export type SecureMessagingMessageMap = {
  [key: string]: SecureMessagingMessageAttributes
}

/**
 * THREADS
 */

export type SecureMessagingThreadGetData = {
  data: SecureMessagingMessageList
}

export type SecureMessagingThreads = Array<string>

/**
 * RECIPIENTS
 */

export type SecureMessagingRecipient = {
  name: string
  preferredTeam: boolean
  relationType: string
  triageTeamId: number
}

/**
 * CATEGORIES
 */

export type SecureMessagingCategory = {
  category: string
}

/**
 * FOLDERS
 */

export type SecureMessagingFolderAttributes = {
  folderId: number
  name: string
  count: number
  unreadCount: number
  systemFolder: boolean
}

export type SecureMessagingFolderData = {
  type: string
  id: string
  attributes: SecureMessagingFolderAttributes
}

export type SecureMessagingFolderGetData = {
  data: SecureMessagingFolderData
}

export type SecureMessagingPaginationLinks = {
  self: string
  first: string
  prev: string
  next: string
  last: string
}

export type SecureMessagingFolderMessagesMeta = {
  sort: SecureMessagingMessagesSortMeta
  pagination: SecureMessagingPaginationMeta
}

export type SecureMessagingFolderMessagesGetData = {
  data: SecureMessagingMessageList
  links: SecureMessagingPaginationLinks
  meta: SecureMessagingMessagesSortMeta
}

export type SecureMessagingFolderList = Array<SecureMessagingFolderData>

export type SecureMessagingFoldersGetData = {
  data: SecureMessagingFolderList
  links: SecureMessagingPaginationLinks
  meta: {
    pagination: SecureMessagingPaginationMeta
  }
}

export type SecureMessagingFolderMap = {
  [key: string]: SecureMessagingFolderData
}

export type SecureMessagingFolderMessagesMap = {
  [key: string]: SecureMessagingFolderMessagesGetData
}
