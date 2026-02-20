import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CategoryTypeFields, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { SecureMessagingFolderMessagesGetData } from 'api/types'
import { FolderNameTypeConstants } from 'constants/secureMessaging'
import FolderMessages from 'screens/HealthScreen/SecureMessaging/FolderMessages/FolderMessages'
import { mockSMAllRecipients, mockSMFolderMessages } from 'screens/HealthScreen/SecureMessaging/smTestHelpers'
import { context, mockNavProps, render, waitFor } from 'testUtils'

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
          isOhMessage: false,
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

  const mockRecipients = {
    data: [
      {
        id: '1',
        type: 'mock',
        attributes: {
          triageTeamId: 1,
          name: 'Test Team',
          relationType: 'PATIENT',
          preferredTeam: true,
          stationNumber: '123',
        },
      },
    ],
    meta: { sort: { name: 'ASC' as const }, careSystems: [] },
  }

  const mockEmptyRecipients = {
    data: [],
    meta: { sort: { name: 'ASC' as const }, careSystems: [] },
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
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, messages)
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
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, {
        data: [],
        links: { self: '', first: '', prev: '', next: '', last: '' },
        meta: {
          sort: { sentDate: 'DESC' },
          pagination: { currentPage: 2, perPage: 1, totalPages: 3, totalEntries: 5 },
        },
      })
      initializeTestInstance()
      await waitFor(() => expect(screen.getByText("You don't have any messages in this folder")).toBeTruthy())
    })
  })

  describe('drafts', () => {
    it('should mark messages as a draft', async () => {
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, messages)
      mockSMAllRecipients(mockRecipients)
      initializeTestInstance(SecureMessagingSystemFolderIdConstants.DRAFTS)
      await waitFor(() => expect(screen.getByText('DRAFT - Recipient')).toBeTruthy())
    })
  })

  describe('start new message button visibility', () => {
    it('should show the button when recipients are available', async () => {
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, messages)
      mockSMAllRecipients(mockRecipients)
      initializeTestInstance(SecureMessagingSystemFolderIdConstants.SENT)
      await waitFor(() => expect(screen.getByTestId('startNewMessageButtonTestID')).toBeTruthy())
    })

    it('should hide the button when no recipients are returned', async () => {
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.SENT, messages)
      mockSMAllRecipients(mockEmptyRecipients)
      initializeTestInstance(SecureMessagingSystemFolderIdConstants.SENT)
      await waitFor(() => expect(screen.queryByTestId('startNewMessageButtonTestID')).toBeNull())
    })

    it('should hide the button when recipients data is undefined', async () => {
      mockSMFolderMessages(SecureMessagingSystemFolderIdConstants.DRAFTS, messages)
      mockSMAllRecipients(undefined)
      initializeTestInstance(SecureMessagingSystemFolderIdConstants.DRAFTS)
      await waitFor(() => expect(screen.queryByTestId('startNewMessageButtonTestID')).toBeNull())
    })
  })
})
