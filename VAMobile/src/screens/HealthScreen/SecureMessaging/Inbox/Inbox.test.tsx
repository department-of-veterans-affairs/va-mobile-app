import 'react-native'
import React from 'react'
import { Pressable } from 'react-native'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, findByTestID, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import Inbox from './Inbox'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'
import { CategoryTypeFields, CategoryTypes } from 'store/api/types'
import { initialAuthState, initialErrorsState, initialSecureMessagingState, fetchInboxMessages } from 'store/slices'
import { LoadingComponent, TextView } from 'components'

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
  let component: RenderAPI

  let props: any
  let testInstance: ReactTestInstance
  let mockNavigateToSpy: jest.Mock

  const initializeTestInstance = (category: CategoryTypes = CategoryTypeFields.other, subjectLine: string = 'Default subject line', loading: boolean = false) => {
    mockNavigateToSpy = jest.fn()
    mockNavigationSpy.mockReturnValue(mockNavigateToSpy)

    props = mockNavProps()

    component = render(<Inbox />, {
      preloadedState: {
        auth: { ...initialAuthState },
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
        errors: initialErrorsState,
      },
    })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  describe('when there are no inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      component = render(<Inbox />, {
        preloadedState: {
          secureMessaging: {
            ...initialSecureMessagingState,
            inboxMessages: [],
          },
        },
      })

      testInstance = component.UNSAFE_root
      await waitFor(() => {
        expect(testInstance.findByType(NoInboxMessages)).toBeTruthy()
      })
    })
  })

  describe('when there are inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      await waitFor(() => {
        expect(testInstance.findAllByType(NoInboxMessages)).toHaveLength(0)
      })
    })
  })

  describe('when a message is clicked', () => {
    it('should call useRouteNavigation', async () => {
      await waitFor(() => {
        testInstance.findAllByType(Pressable)[0].props.onPress()
        expect(mockNavigationSpy).toHaveBeenCalledWith('ViewMessageScreen', { currentPage: 2, folderID: 0, messageID: 1, messagesLeft: 1 })
        expect(mockNavigateToSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.other, '', true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
        expect(testInstance.findAllByType(NoInboxMessages)).toHaveLength(0)
      })
    })
  })

  describe('when subject line is empty', () => {
    it('should show only category with no colon or space after', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.other, '')
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('General')
      })
    })
  })

  describe('when subject category is OTHER', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.other)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('General: Default subject line')
      })
    })
  })

  describe('when subject category is GENERAL', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.general)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('General: Default subject line')
      })
    })
  })

  describe('when subject category is APPOINTMENTS', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.appointment)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('Appointment: Default subject line')
      })
    })
  })

  describe('when subject category is MEDICATION', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.medication)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('Medication: Default subject line')
      })
    })
  })

  describe('when subject category is TEST_RESULTS', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.test)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('Test: Default subject line')
      })
    })
  })

  describe('when subject category is EDUCATION', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.education)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('Education: Default subject line')
      })
    })
  })

  describe('when subject category is COVID', () => {
    it('should show correct text', async () => {
      await waitFor(() => {
        initializeTestInstance(CategoryTypeFields.covid)
        expect(testInstance.findAllByType(TextView)[3].props.children).toBe('COVID: Default subject line')
      })
    })
  })

  describe('pagination', () => {
    it('should call fetchInboxMessages for previous arrow', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'previous-page').props.onPress()
        // was 2 now 1
        expect(fetchInboxMessages).toHaveBeenCalledWith(1, expect.anything())
      })
    })

    it('should call fetchInboxMessages for next arrow', async () => {
      await waitFor(() => {
        findByTestID(testInstance, 'next-page').props.onPress()
        // was 2 now 3
        expect(fetchInboxMessages).toHaveBeenCalledWith(3, expect.anything())
      })
    })
  })
})
