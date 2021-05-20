export const HIDDEN_FOLDERS = new Set(['Inbox'])

export const DRAFTS = 'Drafts'

export const DELETED = 'Deleted'

export const MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES = 3145728

export const MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES = 6291456

export const MAX_IMAGE_DIMENSION = 1375

export const READ = 'READ'

export type formHeaderTypes = 'Reply' | 'Compose'

export const formHeaders: {
  compose: formHeaderTypes
  reply: formHeaderTypes
} = {
  compose: 'Compose',
  reply: 'Reply',
}

export const REPLY_WINDOW_IN_DAYS = -45
