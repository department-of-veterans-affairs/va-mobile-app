import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'

import { CategoryTypeFields, CategoryTypes } from 'api/types'
import { SecureMessagingFolderMessagesGetData, SecureMessagingSystemFolderIdConstants } from 'api/types'
import { LARGE_PAGE_SIZE } from 'constants/common'
import * as api from 'store/api'
import { context, render, waitFor, when } from 'testUtils'

import Inbox from './Inbox'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('Inbox', () => {
  const initializeTestInstance = (
    category: CategoryTypes = CategoryTypeFields.other,
    subjectLine: string = 'Default subject line',
  ) => {
    const messages: SecureMessagingFolderMessagesGetData = {
      data: [
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
    when(api.get as jest.Mock)
      .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
        page: '1',
        per_page: LARGE_PAGE_SIZE.toString(),
        useCache: 'false',
      } as api.Params)
      .mockResolvedValue(messages)
    render(<Inbox setScrollPage={jest.fn()} />)
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when there are no inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      when(api.get as jest.Mock)
        .calledWith(`/v0/messaging/health/folders/${SecureMessagingSystemFolderIdConstants.INBOX}/messages`, {
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
              currentPage: 1,
              perPage: 1,
              totalPages: 3,
              totalEntries: 5,
            },
          },
        })
      render(<Inbox setScrollPage={jest.fn()} />)
      await waitFor(() => expect(screen.getByText('Loading your messages...')).toBeTruthy())
      await waitFor(() => expect(screen.getByText("You don't have any messages in your inbox")).toBeTruthy())
    })
  })

  describe('when a message is clicked', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() =>
        fireEvent.press(screen.getByTestId('Unread: Mock Sender Invalid DateTime General: Default subject line')),
      )
      await waitFor(() =>
        expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessage', {
          currentPage: 1,
          folderID: 0,
          messageID: 1,
        }),
      )
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(CategoryTypeFields.other, '')
      await waitFor(() => expect(screen.getByText('Loading your messages...')).toBeTruthy())
    })
  })

  describe('when subject line is empty', () => {
    it('should show only category with no colon or space after', async () => {
      initializeTestInstance(CategoryTypeFields.other, '')
      await waitFor(() => expect(screen.getByText('General')).toBeTruthy())
    })
  })

  describe('when subject category is OTHER', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.other)
      await waitFor(() => expect(screen.getByText('General: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is GENERAL', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.general)
      await waitFor(() => expect(screen.getByText('General: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is APPOINTMENTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.appointment)
      await waitFor(() => expect(screen.getByText('Appointment: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is MEDICATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.medication)
      await waitFor(() => expect(screen.getByText('Medication: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is TEST_RESULTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.test)
      await waitFor(() => expect(screen.getByText('Test: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is EDUCATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.education)
      await waitFor(() => expect(screen.getByText('Education: Default subject line')).toBeTruthy())
    })
  })

  describe('when subject category is COVID', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.covid)
      await waitFor(() => expect(screen.getByText('COVID: Default subject line')).toBeTruthy())
    })
  })
})
