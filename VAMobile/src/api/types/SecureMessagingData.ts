/**
 * META
 */
import { ImagePickerResponse } from 'react-native-image-picker/src/types'

import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

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
  recipientId?: number
  recipientName: string
  readReceipt?: string
}

export type CategoryTypes =
  | 'COVID'
  | 'TEST_RESULTS'
  | 'MEDICATIONS'
  | 'APPOINTMENTS'
  | 'OTHER'
  | 'GENERAL'
  | 'EDUCATION'
  | ''

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

export type SecureMessagingSaveDraftData = {
  data: SecureMessagingMessageData
}

export type SecureMessagingMessageGetData = {
  data: SecureMessagingMessageData
  included: Array<{
    attributes: {
      name: string
      attachmentSize: number
    }
    id: number
    links: {
      download: string
    }
    type: string
  }>
}

export type SecureMessagingMessageList = Array<SecureMessagingMessageData>

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

/**
 * RECIPIENTS
 */

export type SecureMessagingRecipient = {
  name: string
  preferredTeam: boolean
  relationType: string
  triageTeamId: number
}

export type SecureMessagingFolderData = {
  type: string
  id: string
  attributes: {
    folderId: number
    name: string
    count: number
    unreadCount: number
    systemFolder: boolean
  }
}

export type SecureMessagingFolderGetData = {
  data: {
    type: string
    id: string
    attributes: {
      folderId: number
      name: string
      count: number
      unreadCount: number
      systemFolder: boolean
    }
  }
}

export type SecureMessagingPaginationLinks = {
  self: string
  first: string
  prev: string
  next: string
  last: string
}

export type SecureMessagingFolderMessagesMeta = {
  sort: {
    sentDate: string
  }
  pagination: {
    currentPage: number
    perPage: number
    totalPages: number
    totalEntries: number
  }
}

export type SecureMessagingFolderMessagesGetData = {
  data: SecureMessagingMessageList
  links: SecureMessagingPaginationLinks
  meta: SecureMessagingFolderMessagesMeta
}

export type SecureMessagingFolderList = Array<{
  type: string
  id: string
  attributes: {
    folderId: number
    name: string
    count: number
    unreadCount: number
    systemFolder: boolean
  }
}>

export type SecureMessagingFoldersGetData = {
  data: SecureMessagingFolderList
  links: SecureMessagingPaginationLinks
  inboxUnreadCount: number
  meta: {
    pagination: {
      currentPage: number
      perPage: number
      totalPages: number
      totalEntries: number
    }
  }
}

export type SecureMessagingRecipientData = {
  id: string
  type: string
  attributes: {
    triageTeamId: number
    name: string
    relationType: 'PATIENT'
    preferredTeam: boolean
  }
}

export type SecureMessagingRecipientDataList = Array<SecureMessagingRecipientData>

export type SecureMessagingRecipients = {
  data: SecureMessagingRecipientDataList
  meta: {
    sort: {
      name: 'ASC' | 'DESC'
    }
  }
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

export type SaveDraftParameters = {
  messageID?: number
  replyID?: number
  messageData: SecureMessagingFormData
}

export type SendMessageParameters = {
  messageData: SecureMessagingFormData
  uploads?: Array<ImagePickerResponse | DocumentPickerResponse>
  replyToID?: number
}

export type DeleteMessageParameters = {
  messageID: number
}

export type MoveMessageParameters = {
  messageID: number
  newFolderID: number
}
