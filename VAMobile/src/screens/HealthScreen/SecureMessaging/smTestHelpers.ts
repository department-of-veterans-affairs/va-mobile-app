/**
 * Shared test helpers for SecureMessaging API mock setup.
 *
 * These composable functions eliminate the duplicated `when(api.get as jest.Mock)`
 * chains that appear across SM test files. Each function mocks a single endpoint,
 * so tests can combine only the endpoints they need.
 */
import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { when } from 'testUtils'

/** Mock the thread endpoint: GET /v1/messaging/health/messages/{id}/thread */
export const mockSMThread = (messageId: number, data: unknown, excludeProvidedMessage = false) => {
  when(api.get as jest.Mock)
    .calledWith(`/v1/messaging/health/messages/${messageId}/thread?excludeProvidedMessage=${excludeProvidedMessage}`, {
      useCache: 'false',
    })
    .mockResolvedValue(data)
}

/** Mock the single message endpoint: GET /v0/messaging/health/messages/{id} */
export const mockSMMessage = (messageId: number, data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith(`/v0/messaging/health/messages/${messageId}`)
    .mockResolvedValue(data)
}

/** Mock the all recipients endpoint: GET /v0/messaging/health/allrecipients */
export const mockSMAllRecipients = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/allrecipients')
    .mockResolvedValue(data)
}

/** Mock the all recipients endpoint to reject with an error */
export const mockSMAllRecipientsError = (error: unknown = { networkError: true } as api.APIError) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/allrecipients')
    .mockRejectedValue(error)
}

/** Mock the folder messages endpoint: GET /v0/messaging/health/folders/{folderId}/messages */
export const mockSMFolderMessages = (folderId: number, data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith(`/v0/messaging/health/folders/${folderId}/messages`, {
      page: '1',
      per_page: LARGE_PAGE_SIZE.toString(),
      useCache: 'false',
    } as api.Params)
    .mockResolvedValue(data)
}

/** Mock the folders list endpoint: GET /v0/messaging/health/folders */
export const mockSMFolders = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/folders')
    .mockResolvedValue(data)
}

/** Mock the signature endpoint: GET /v0/messaging/health/messages/signature */
export const mockSMSignature = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/messages/signature')
    .mockResolvedValue(data)
}

/**
 * Convenience: Mock the 4 endpoints used by EditDraft tests.
 * (thread + message + allrecipients + SENT folder messages)
 */
export const mockEditDraftEndpoints = (opts: {
  messageId: number
  thread: unknown
  message: unknown
  recipients: unknown
  folderMessages: unknown
}) => {
  mockSMThread(opts.messageId, opts.thread, false)
  mockSMMessage(opts.messageId, opts.message)
  mockSMAllRecipients(opts.recipients)
  mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, opts.folderMessages)
}

/**
 * Convenience: Mock the 4 endpoints used by ViewMessageScreen tests.
 * (thread + message + folders list + INBOX folder messages)
 */
export const mockViewMessageEndpoints = (opts: {
  messageId: number
  thread: unknown
  message: unknown
  folders: unknown
  inboxMessages: unknown
}) => {
  mockSMThread(opts.messageId, opts.thread, true)
  mockSMMessage(opts.messageId, opts.message)
  mockSMFolders(opts.folders)
  mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.INBOX, opts.inboxMessages)
}
