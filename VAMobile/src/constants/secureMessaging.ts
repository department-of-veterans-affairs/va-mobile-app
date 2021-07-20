export const HIDDEN_FOLDERS = new Set(['Inbox'])

export const MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES = 3145728

export const MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES = 6291456

export const MAX_IMAGE_DIMENSION = 1375

export const READ = 'READ'

export type FolderNameType = 'Drafts' | 'Deleted' | 'Sent'

export const FolderNameTypeConstants: {
  drafts: FolderNameType
  deleted: FolderNameType
  sent: FolderNameType
} = {
  drafts: 'Drafts',
  deleted: 'Deleted',
  sent: 'Sent',
}

export type FormHeaderType = 'Reply' | 'Compose'

export const FormHeaderTypeConstants: {
  compose: FormHeaderType
  reply: FormHeaderType
} = {
  compose: 'Compose',
  reply: 'Reply',
}

export type ComposeType = 'new' | 'reply' | 'draft' | 'replyDraft'

export const ComposeTypeConstants: {
  new: ComposeType
  reply: ComposeType
  draft: ComposeType
} = {
  new: 'new',
  reply: 'reply',
  draft: 'draft',
}

export const REPLY_WINDOW_IN_DAYS = -45
