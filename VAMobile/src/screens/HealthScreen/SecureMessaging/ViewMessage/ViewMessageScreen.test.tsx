import 'react-native'
import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { context, mockNavProps, render } from 'testUtils'
import { CategoryTypeFields, SecureMessagingMessageMap, SecureMessagingThreads } from 'store/api/types'
import { initialAuthState, initialErrorsState, initialSecureMessagingState } from 'store/slices'
import ViewMessageScreen from './ViewMessageScreen'
import { DateTime } from 'luxon'

// Contains message Ids grouped together by thread
const mockThreads: Array<Array<number>> = [[1, 2, 3], [45]]

// Contains message attributes mapped to their ids
const mockMessagesById: SecureMessagingMessageMap = {
  1: {
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
  2: {
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
  3: {
    messageId: 3,
    category: CategoryTypeFields.other,
    subject: '',
    body: 'First accordion collapsible should be open, so the body text of this message should display',
    hasAttachments: false,
    attachment: false,
    sentDate: DateTime.local().toISO(),
    senderId: 2,
    senderName: 'mock sender 3',
    recipientId: 3,
    recipientName: 'mock recipient name 3',
    readReceipt: 'mock read receipt',
  },
  45: {
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
}

context('ViewMessageScreen', () => {
  const initializeTestInstance = (
    mockMessagesById: SecureMessagingMessageMap,
    threadList: SecureMessagingThreads,
    loading: boolean = false,
    messageID: number = 3,
    messageIDsOfError?: Array<number>,
  ) => {
    render(<ViewMessageScreen {...mockNavProps(
      undefined,
      {
        navigate: jest.fn(),
        setOptions: jest.fn(),
        goBack: jest.fn(),
      },
      { params: { messageID: messageID } },
    )} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        secureMessaging: {
          ...initialSecureMessagingState,
          loading: loading,
          messagesById: mockMessagesById,
          threads: threadList,
          messageIDsOfError: messageIDsOfError,
        },
        errors: initialErrorsState,
      },
    })
  }

  describe('when latest message is older than 45 days', () => {
    beforeEach(() => {
      initializeTestInstance(mockMessagesById, mockThreads, false, 45)
    })
    it('should have the Start new message button', () => {
      expect(screen.getByText('mock sender 45')).toBeTruthy()
      expect(screen.getByText('Start new message')).toBeTruthy()
      expect(screen.getByText('This conversation is too old for new replies')).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance({}, [], true)
      expect(screen.getByText('Loading your message...')).toBeTruthy()
    })
  })

  describe('Should load the screen correctly', () => {
    beforeEach(() => {
      initializeTestInstance(mockMessagesById, mockThreads)
    })

    it('renders CollapsibleMessage card for the initialMessage', () => {
      expect(screen.getByText('mock sender 3')).toBeTruthy()
    })

    it('renders correct amount of CollapsibleMessages', () => {
      expect(screen.getAllByRole('tab').length).toBe(2)
      expect(screen.getByText('mock sender 1')).toBeTruthy()
      expect(screen.getByText('mock sender 2')).toBeTruthy()
      expect(screen.queryByText('mock sender 45')).toBeFalsy()
    })
    
    it('should have the reply button since the latest message is within 45 days', () => {
      expect(screen.getByText('Reply')).toBeTruthy()
    })
  })

  describe('when individual messages fail to load', () => {
    describe('when an individual message returns an error and that message is clicked', () => {
      beforeEach(() => {
        initializeTestInstance(mockMessagesById, mockThreads, false, 3, [1])
      })
      it('should show AlertBox with "Message could not be found" title', async () => {
        expect(screen.getByText('mock sender 1')).toBeTruthy()
        fireEvent.press(screen.getByText('mock sender 1'))
        expect(screen.getByText("If the app still doesn't work, call the My HealtheVet Help Desk. We're here Monday-Friday, 8:00 a.m.-8:00 p.m. ET.")).toBeTruthy()
        expect(screen.getByText('Message could not be found')).toBeTruthy()
      })
    })
  })
})
