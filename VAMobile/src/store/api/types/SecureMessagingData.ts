export type SecureMessagingRecipient = {
  name: string
  preferredTeam: boolean
  relationType: string
  triageTeamId: number
}

export type SecureMessagingFolderAttributes = {
  folderId: number
  name: string
  count: number
  unreadCount: number
  systemFolder: boolean
}

export type SecureMessagingFolderLinks = {
  self: string
}

export type SecureMessageSummaryAttributes = {
  messageId: number
  category: string
  subject: string
  body?: string
  attachment: boolean
  sentDate: string
  senderId: number
  senderName: string
  recipientId: number
  recipientName: string
  readReceipt?: string
}

export type SecureMessagingCategory = {
  category: string
}

export type SecureMessagingFolderResource = {
  type: string
  id: string
  attributes: SecureMessagingFolderAttributes
  links: SecureMessagingFolderLinks
}

export type SecureMessagingFolderData = {
  data: SecureMessagingFolderResource
}

export type SecureMessageSummaryData = {
  type: string
  id: string
  attributes: SecureMessageSummaryAttributes
}

export type SecureMessagesList = Array<SecureMessageSummaryData>

export type SecureMessagingPaginationLinks = {
  self: string
  first: string
  prev: string
  next: string
  last: string
}

export type SecureMessagesListSortMeta = {
  sentDate: string
}

export type SecureMessagingPaginationMeta = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
}

export type SecureMessagesListMeta = {
  sort: SecureMessagesListSortMeta
  pagination: SecureMessagingPaginationMeta
}

export type SecureMessagesListData = {
  data: SecureMessagesList
  links: SecureMessagingPaginationLinks
  meta: SecureMessagesListMeta
}

export type SecureMessagingFolderList = Array<SecureMessagingFolderResource>

export type SecureMessagingFolderListData = {
  data: SecureMessagingFolderList
  links: SecureMessagingPaginationLinks
  meta: {
    pagination: SecureMessagingPaginationMeta
  }
}

export type FolderMap = {
  [key: string]: SecureMessagingFolderResource
}

export type FolderMessagesMap = {
  [key: string]: SecureMessagesListData
}

export type SecureMessageMap = {
  [key: string]: SecureMessageSummaryData
}
