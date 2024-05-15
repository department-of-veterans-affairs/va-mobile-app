import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CategoryTypeFields, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import FolderMessages from './FolderMessages'

const mockNavigationSpy = jest.fn()
jest.mock('/utils/hooks', () => {
  const original = jest.requireActual('/utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('FolderMessages', () => {
  const messages: SecureMessagingFolderMessagesGetData = {
    data: [
      {
        type: 'type',
        id: 0,
        attributes: {
          messageId: 1,
          category: CategoryTypeFields.other,
          subject: 'subject',
          hasAttachments: true,
          attachment: true,
          sentDate: '03-12-2021',
          senderId: 0,
          senderName: 'name',
          recipientId: 1,
          recipientName: 'recipient',
        },
      },
    ],
    links: {
      self: '',
      first: '',
      prev: '',
      next: '',
      last: '',
    },
    meta: {
      sort: {
        sentDate: 'DESC',
      },
      pagination: {
        currentPage: 1,
        perPage: 1,
        totalPages: 3,
        totalEntries: 5,
      },
    },
  }

  const initializeTestInstance = (folderID = SecureMessagingSystemFolderIdConstants.SENT, draftSaved = false) => {
    let folderName
    if (folderID > 0) folderName = 'Custom'
    else if (folderID === -1) folderName = FolderNameTypeConstants.sent
    else if (folderID === -2) folderName = FolderNameTypeConstants.drafts
    const props = mockNavProps(
      undefined,
      {
        navigate: mockNavigationSpy,
      },
      { params: { folderID: folderID, folderName: folderName, draftSaved: draftSaved } },
    )
    render(<FolderMessages {...props} />)
  }

  describe('when a message is pressed', () => {
    it('should call navigate', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)
      initializeTestInstance()
      expect(screen.getByText('Loading your messages...')).toBeTruthy()
      await waitFor(() =>
        fireEvent.press(screen.getByTestId('Recipient Invalid DateTime Has attachment General: subject')),
      )
      await waitFor(() => expect(mockNavigationSpy).toHaveBeenCalled())
    })
  })

  describe('when there are no messages', () => {
    it('should render the NoFolderMessages', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.SENT}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue({
          data: [],
          links: {
            self: '',
            first: '',
            prev: '',
            next: '',
            last: '',
          },
          meta: {
            sort: {
              sentDate: 'DESC',
            },
            pagination: {
              currentPage: 2,
              perPage: 1,
              totalPages: 3,
              totalEntries: 5,
            },
          },
        })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy())
    })
  })

  describe('drafts', () => {
    it('should mark messages as a draft', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.DRAFTS}/messages`, {
          page: '1',
          per_page: LARGE_PAGE_SIZE.toString(),
          useCache: 'false',
        } as api.Params)
        .mockResolvedValue(messages)
      initializeTestInstance(SecureMessagingSystemFolderIdConstants.DRAFTS)
      await waitFor(() => expect(screen.getByText('DRAFT - Recipient')).toBeTruthy())
    })
  })
})
