import { SecureMessagingSystemFolderIdConstants } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { when } from 'testUtils'

export const mockSMThread = (messageId: number, data: unknown, excludeProvidedMessage = false) => {
  when(api.get as jest.Mock)
    .calledWith(`/v1/messaging/health/messages/${messageId}/thread?excludeProvidedMessage=${excludeProvidedMessage}`, {
      useCache: 'false',
    })
    .mockResolvedValue(data)
}

export const mockSMMessage = (messageId: number, data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith(`/v0/messaging/health/messages/${messageId}`)
    .mockResolvedValue(data)
}

export const mockSMAllRecipients = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/allrecipients')
    .mockResolvedValue(data)
}

export const mockSMAllRecipientsError = (error: unknown = { networkError: true } as api.APIError) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/allrecipients')
    .mockRejectedValue(error)
}

export const mockSMFolderMessages = (folderId: number, data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith(`/v0/messaging/health/folders/${folderId}/messages`, {
      page: '1',
      per_page: LARGE_PAGE_SIZE.toString(),
      useCache: 'false',
    } as api.Params)
    .mockResolvedValue(data)
}

export const mockSMFolders = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/folders')
    .mockResolvedValue(data)
}

export const mockSMSignature = (data: unknown) => {
  when(api.get as jest.Mock)
    .calledWith('/v0/messaging/health/messages/signature')
    .mockResolvedValue(data)
}

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
