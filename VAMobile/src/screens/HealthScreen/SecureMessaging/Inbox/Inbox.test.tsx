import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render} from 'testUtils'
import Inbox from './Inbox'
import { CategoryTypeFields, CategoryTypes } from 'store/api/types'
import { initialSecureMessagingState } from 'store/slices'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    fetchInboxMessages: jest.fn(() => {
      return {
        type: '',
        payload: {},
      }
    }),
  }
})

context('Inbox', () => {
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = (category: CategoryTypes = CategoryTypeFields.other, subjectLine: string = 'Default subject line', loading: boolean = false) => {
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

    render(<Inbox />, {
      preloadedState: {
        secureMessaging: {
          ...initialSecureMessagingState,
          loadingInbox: loading,
          inboxMessages: [
            {
              type: 'test',
              id: 1,
              attributes: {
                messageId: 1,
                category: category,
                subject: subjectLine ? subjectLine : '',
                body: 'test',
                hasAttachments: false,
                attachment: false,
                sentDate: '1-1-21',
                senderId: 2,
                senderName: 'mock sender',
                recipientId: 3,
                recipientName: 'mock recipient name',
                readReceipt: 'mock read receipt',
              },
            },
          ],
          paginationMetaByFolderId: {
            [0]: {
              currentPage: 2,
              perPage: 1,
              totalPages: 3,
              totalEntries: 5,
            },
          },
        },
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when there are no inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      render(<Inbox />, {
        preloadedState: {
          secureMessaging: {
            ...initialSecureMessagingState,
            inboxMessages: [],
          },
        },
      })
      expect(screen.getByText("You don't have any messages in your inbox")).toBeTruthy()
    })
  })

  describe('when a message is clicked', () => {
    it('should call useRouteNavigation', async () => {
      fireEvent.press(screen.getByTestId('Unread: Mock Sender Invalid DateTime General: Default subject line'))
      expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessageScreen', { currentPage: 2, folderID: 0, messageID: 1, messagesLeft: 1 })
      expect(mockNavigateToSpy).toHaveBeenCalled()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(CategoryTypeFields.other, '', true)
      expect(screen.getByText('Loading your messages...')).toBeTruthy()
    })
  })

  describe('when subject line is empty', () => {
    it('should show only category with no colon or space after', async () => {
      initializeTestInstance(CategoryTypeFields.other, '')
      expect(screen.getByText('General')).toBeTruthy()
    })
  })

  describe('when subject category is OTHER', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.other)
      expect(screen.getByText('General: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is GENERAL', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.general)
      expect(screen.getByText('General: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is APPOINTMENTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.appointment)
      expect(screen.getByText('Appointment: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is MEDICATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.medication)
      expect(screen.getByText('Medication: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is TEST_RESULTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.test)
      expect(screen.getByText('Test: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is EDUCATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.education)
      expect(screen.getByText('Education: Default subject line')).toBeTruthy()
    })
  })

  describe('when subject category is COVID', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.covid)
      expect(screen.getByText('COVID: Default subject line')).toBeTruthy()
    })
  })
})
