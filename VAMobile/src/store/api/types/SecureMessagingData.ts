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
  readReceipt?: boolean
}

export type SecureMessagingCategory = {
  category: string
}

export type SecureMessagingFolderData = {
  type: string
  id: string
  attributes: SecureMessagingFolderAttributes
  links: SecureMessagingFolderLinks
}

export type SecureMessageSummaryData = {
  type: string
  id: string
  attributes: SecureMessageSummaryAttributes
}

export type SecureMessagesList = Array<SecureMessageSummaryData>

export type SecureMessagesListData = {
  data: SecureMessagesList
  //TODO
  //links:
  //meta:
}

export type SecureMessagingFolderList = Array<SecureMessagingFolderData>

export type SecureMessagingFolderListData = {
  data: SecureMessagingFolderList
  //TODO
  //links:
  //meta:
}

export type FolderMap = {
  [key: string]: SecureMessagingFolderData
}

export type FolderMessagesMap = {
  [key: string]: SecureMessagesListData
}

export type SecureMessageMap = {
  [key: string]: SecureMessageSummaryData
}
