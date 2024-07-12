import React from 'react'

import { screen } from '@testing-library/react-native'

import {
  CategoryTypeFields,
  SecureMessagingFoldersGetData,
  SecureMessagingMessageGetData,
  SecureMessagingThreadGetData,
} from 'api/types'
import * as api from 'store/api'
import { context, mockNavProps, render, waitFor, when } from 'testUtils'

import ViewMessageScreen from './ViewMessageScreen'

context('ViewMessageScreen', () => {
  const thread: SecureMessagingThreadGetData = {
    data: [
      {
        id: 1,
        type: '1',
        attributes: {
          messageId: 1,
          category: CategoryTypeFields.other,
          subject: 'mock subject 1: The initial message sets the overall thread subject header',
          body: 'message 1 body text',
          hasAttachments: false,
          attachment: false,
          sentDate: '1',
          senderId: 2,
          senderName: 'mock sender 1',
          recipientId: 3,
          recipientName: 'mock recipient name 1',
          readReceipt: 'mock read receipt 1',
        },
      },
      {
        id: 2,
        type: '1',
        attributes: {
          messageId: 2,
          category: CategoryTypeFields.other,
          subject: '',
          body: 'test 2',
          hasAttachments: false,
          attachment: false,
          sentDate: '2',
          senderId: 2,
          senderName: 'mock sender 2',
          recipientId: 3,
          recipientName: 'mock recipient name 2',
          readReceipt: 'mock read receipt 2',
        },
      },
      {
        id: 3,
        type: '3',
        attributes: {
          messageId: 3,
          category: CategoryTypeFields.other,
          subject: '',
          body: 'Last accordion collapsible should be open, so the body text of this message should display 1-800-698-2411.Thank',
          hasAttachments: false,
          attachment: false,
          sentDate: '3',
          senderId: 2,
          senderName: 'mock sender 3',
          recipientId: 3,
          recipientName: 'mock recipient name 3',
          readReceipt: 'mock read receipt',
        },
      },
    ],
  }
  const oldThread: SecureMessagingThreadGetData = {
    data: [],
  }
  const oldMessage: SecureMessagingMessageGetData = {
    data: {
      id: 45,
      type: '3',
      attributes: {
        messageId: 45,
        category: CategoryTypeFields.other,
        subject: 'This message should not display because it has different thread ID',
        body: 'test',
        hasAttachments: false,
        attachment: false,
        sentDate: '2013-06-06T04:00:00.000+00:00',
        senderId: 2,
        senderName: 'mock sender 45',
        recipientId: 3,
        recipientName: 'mock recipient name',
        readReceipt: 'mock read receipt',
      },
    },
    included: [],
  }

  const message: SecureMessagingMessageGetData = {
    data: {
      id: 3,
      type: '3',
      attributes: {
        messageId: 3,
        category: CategoryTypeFields.other,
        subject: '',
        body: 'Last accordion collapsible should be open, so the body text of this message should display 1-800-698-2411.Thank',
        hasAttachments: false,
        attachment: false,
        sentDate: '3',
        senderId: 2,
        senderName: 'mock sender 3',
        recipientId: 3,
        recipientName: 'mock recipient name 3',
        readReceipt: 'mock read receipt',
      },
    },
    included: [],
  }

  const listOfFolders: SecureMessagingFoldersGetData = {
    data: [
      {
        type: 'folders',
        id: '-2',
        attributes: {
          folderId: -2,
          name: 'Drafts',
          count: 2,
          unreadCount: 2,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '-1',
        attributes: {
          folderId: -1,
          name: 'Sent',
          count: 32,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '-3',
        attributes: {
          folderId: -3,
          name: 'Deleted',
          count: 24,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '100',
        attributes: {
          folderId: 100,
          name: 'test 1',
          count: 3,
          unreadCount: 0,
          systemFolder: true,
        },
      },
      {
        type: 'folders',
        id: '101',
        attributes: {
          folderId: 101,
          name: 'test 2',
          count: 12,
          unreadCount: 0,
          systemFolder: true,
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
      pagination: {
        currentPage: 1,
        perPage: 10,
        totalPages: 1,
        totalEntries: 5,
      },
    },
    inboxUnreadCount: 0,
  }

  const initializeTestInstance = (messageID: number = 3) => {
    render(
      <ViewMessageScreen
        {...mockNavProps(
          undefined,
          {
            navigate: jest.fn(),
            setOptions: jest.fn(),
            goBack: jest.fn(),
          },
          { params: { messageID: messageID } },
        )}
      />,
    )
  }

  describe('when latest message is older than 45 days', () => {
    it('should have the Start new message button', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${45}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(oldThread)
        .calledWith(`/v0/messaging/health/messages/${45}`)
        .mockResolvedValue(oldMessage)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
      initializeTestInstance(45)
      await waitFor(() => expect(screen.getByText('mock sender 45')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Start new message')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('This conversation is too old for new replies')).toBeTruthy())
    })
  })

  describe('Should load the screen correctly', () => {
    it('renders correct amount of CollapsibleMessages', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v1/messaging/health/messages/${3}/thread?excludeProvidedMessage=${true}`, {
          useCache: 'false',
        })
        .mockResolvedValue(thread)
        .calledWith(`/v0/messaging/health/messages/${3}`)
        .mockResolvedValue(message)
        .calledWith('/v0/messaging/health/folders')
        .mockResolvedValue(listOfFolders)
      initializeTestInstance()
      expect(screen.getByText('Loading your message...')).toBeTruthy()
      await waitFor(() => expect(screen.queryByRole('link', { name: '1-800-698-2411.Thank' })).toBeFalsy())
      await waitFor(() => expect(screen.getAllByRole('tab').length).toBe(2))
      await waitFor(() => expect(screen.getByText('mock sender 1')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('mock sender 2')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('mock sender 3')).toBeTruthy())
      await waitFor(() => expect(screen.queryByText('mock sender 45')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Reply')).toBeTruthy())
    })
  })
})
