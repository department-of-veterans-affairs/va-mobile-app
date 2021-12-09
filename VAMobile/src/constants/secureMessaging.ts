export const HIDDEN_FOLDERS = new Set(['Inbox'])

export const MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES = 3145728

export const MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES = 6291456

export const MAX_IMAGE_DIMENSION = 1375

export const READ = 'READ'

export const TRASH_FOLDER_NAME = 'Trash'

export type FolderNameType = 'Drafts' | 'Deleted' | 'Sent' | 'Inbox'

export const FolderNameTypeConstants: {
  drafts: FolderNameType
  deleted: FolderNameType
  sent: FolderNameType
  inbox: FolderNameType
} = {
  drafts: 'Drafts',
  deleted: 'Deleted',
  sent: 'Sent',
  inbox: 'Inbox',
}

export type FormHeaderType = 'Reply' | 'Compose' | 'Draft'

export const FormHeaderTypeConstants: {
  compose: FormHeaderType
  reply: FormHeaderType
  draft: FormHeaderType
} = {
  compose: 'Compose',
  reply: 'Reply',
  draft: 'Draft',
}

export const REPLY_WINDOW_IN_DAYS = -45
