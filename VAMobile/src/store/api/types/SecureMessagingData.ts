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
  category: CategoryTypes
  subject: string
  body?: string
  hasAttachments: boolean
  attachment: boolean
  attachments?: Array<SecureMessagingAttachment>
  sentDate: string
  senderId: number
  senderName: string
  recipientId: number
  recipientName: string
  readReceipt?: string
}

export type CategoryTypes = 'COVID' | 'TEST_RESULTS' | 'MEDICATIONS' | 'APPOINTMENTS' | 'OTHER' | 'GENERAL' | 'EDUCATION' | ''

export const CategoryTypeFields: {
  covid: CategoryTypes
  test: CategoryTypes
  medication: CategoryTypes
  appointment: CategoryTypes
  other: CategoryTypes
  general: CategoryTypes
  education: CategoryTypes
} = {
  covid: 'COVID',
  test: 'TEST_RESULTS',
  medication: 'MEDICATIONS',
  appointment: 'APPOINTMENTS',
  other: 'OTHER',
  general: 'GENERAL',
  education: 'EDUCATION',
}

export type SecureMessagingAttachment = {
  id: number
  filename: string
  link: string
  size: number
}

export type SecureMessagingMessageData = {
  type: string
  id: number
  attributes: SecureMessagingMessageAttributes
}

export type SecureMessagingMessageIncluded = {
  attributes: {
    name: string
    attachmentSize: number
  }
  id: number
  links: {
    download: string
  }
  type: string
}

export type SecureMessagingSaveDraftData = {
  data: SecureMessagingMessageData
}

export type SecureMessagingMessageGetData = {
  data: SecureMessagingMessageData
  included: Array<SecureMessagingMessageIncluded>
}

export type SecureMessagingMessageList = Array<SecureMessagingMessageData>

export type SecureMessagingMessageMap = {
  [key: string]: SecureMessagingMessageAttributes
}

export type SecureMessagingFormData = {
  recipient_id?: number
  category: CategoryTypes
  body: string
  subject?: string
  draft_id?: number
}

/**
 * THREADS
 */

export type SecureMessagingThreadGetData = {
  data: SecureMessagingMessageList
}

export type SecureMessagingThreads = Array<Array<number>>

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
  meta: SecureMessagingFolderMessagesMeta
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

export type SecureMessagingRecipientsMetaSortName = 'ASC' | 'DESC'

export type SecureMessagingRecipientsMetaSort = {
  name: SecureMessagingRecipientsMetaSortName
}

export type SecureMessagingRecipientsMeta = {
  sort: SecureMessagingRecipientsMetaSort
}

export type SecureMessagingRecipientDataAttributesRelationType = 'PATIENT'

export type SecureMessagingRecipientDataAttributes = {
  triageTeamId: number
  name: string
  relationType: SecureMessagingRecipientDataAttributesRelationType
  preferredTeam: boolean
}

export type SecureMessagingRecipientData = {
  id: string
  type: string
  attributes: SecureMessagingRecipientDataAttributes
}

export type SecureMessagingRecipientDataList = Array<SecureMessagingRecipientData>

export type SecureMessagingRecipients = {
  data: SecureMessagingRecipientDataList
  meta: SecureMessagingRecipientsMeta
}

export const SecureMessagingSystemFolderIdConstants: {
  INBOX: number
  SENT: number
  DRAFTS: number
  DELETED: number
} = {
  INBOX: 0,
  SENT: -1,
  DRAFTS: -2,
  DELETED: -3,
}

export type SecureMessagingSignatureDataAttributes = {
  signatureName: string
  includeSignature: boolean
  signatureTitle: string
}

export type SecureMessagingSignatureData = {
  data: {
    id: string
    type: string
    attributes: SecureMessagingSignatureDataAttributes
  }
}
