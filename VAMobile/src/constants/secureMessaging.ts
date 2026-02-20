export const SegmentedControlIndexes: {
  INBOX: number
  FOLDERS: number
} = {
  INBOX: 0,
  FOLDERS: 1,
}

export const HIDDEN_FOLDERS = new Set(['Inbox'])

export const MAX_SINGLE_MESSAGE_ATTACHMENT_SIZE_IN_BYTES = 6291456

export const MAX_TOTAL_MESSAGE_ATTACHMENTS_SIZE_IN_BYTES = 10485760

export const MAX_IMAGE_DIMENSION = 1375

export const READ = 'READ'

export const UNREAD = 'UNREAD'

export const TRASH_FOLDER_NAME = 'Trash'

export const PREPOPULATE_SIGNATURE = true

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

/**
 * OH (Oracle Health) migration phases that block message replies.
 * During facility migration from VistA to Oracle Health, replies are blocked
 * during certain phases (T-6 through T+2):
 * - p3: T-6 to T-3
 * - p4: T-3 to T-1
 * - p5: T to T+2
 */
export const OH_MIGRATION_PHASES_BLOCKING_REPLIES = ['p3', 'p4', 'p5']

/**
 * Check if the given OH migration phase blocks replies.
 */
export const isMigrationPhaseBlockingReplies = (ohMigrationPhase?: string | null): boolean => {
  return !!ohMigrationPhase && OH_MIGRATION_PHASES_BLOCKING_REPLIES.includes(ohMigrationPhase)
}
