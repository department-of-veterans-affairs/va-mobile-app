import 'react-native'
import React from 'react'
import {Pressable} from "react-native";
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, findByTestID, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import Inbox from './Inbox'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'
import {
  CategoryTypeFields,
  CategoryTypes,
} from 'store/api/types'
import {initialAuthState, initialErrorsState, initialSecureMessagingState} from 'store'
import {LoadingComponent, TextView} from 'components'
import {fetchInboxMessages} from 'store/actions'


let mockNavigationSpy = jest.fn()
jest.mock('/utils/hooks', () => {
  let original = jest.requireActual("/utils/hooks")
  let theme = jest.requireActual("/styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
    useRouteNavigation: () => { return () => mockNavigationSpy},
  }
})

jest.mock('../../../../store/actions', () => {
  let actual = jest.requireActual('../../../../store/actions')
  return {
    ...actual,
    fetchInboxMessages: jest.fn(() => {
      return {
        type: '',
        payload: {}
      }
    })
  }
})

context('Inbox', () => {
  let component: any
  let store: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (category: CategoryTypes = CategoryTypeFields.other , subjectLine: string = 'Default subject line', loading: boolean = false) => {
    props = mockNavProps()

    store = mockStore({
      auth: {...initialAuthState},
      secureMessaging: {
        ...initialSecureMessagingState,
        loading: loading,
        inboxMessages: [{
          type: 'test',
          id: 1,
          attributes: {
            messageId: 1,
            category: category,
            subject: subjectLine? subjectLine : '',
            body: 'test',
            attachment: false,
            sentDate: '1-1-21',
            senderId: 2,
            senderName: 'mock sender',
            recipientId: 3,
            recipientName: 'mock recipient name',
            readReceipt: 'mock read receipt'
          },
        }],
        paginationMetaByFolderId: {
          [0]: {
            currentPage: 2,
            perPage: 1,
            totalPages: 3,
            totalEntries: 5
          }
        }
      },
      errors: initialErrorsState,

    })

    act(() => {
      component = renderWithProviders(
        <Inbox/>, store
      )
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there are no inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      store = mockStore({
        secureMessaging: {
          ...initialSecureMessagingState,
          inboxMessages: []
        }
      })

      act(() => {
        component = renderWithProviders(
          <Inbox/>, store
        )
      })

      testInstance = component.root
      expect(testInstance.findByType(NoInboxMessages)).toBeTruthy()
    })
  })

  describe('when there are inbox messages', () => {
    it('should render NoInboxMessages', async () => {
      expect(testInstance.findAllByType(NoInboxMessages)).toHaveLength(0)
    })
  })

  describe('when a message is clicked', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(CategoryTypeFields.other, '', true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when subject line is empty', () => {
    it('should show only category with no colon or space after', async () => {
      initializeTestInstance(CategoryTypeFields.other, '')
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('General')
    })
  })

  describe('when subject category is OTHER', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.other)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('General: Default subject line')
    })
  })

  describe('when subject category is GENERAL', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.general)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('General: Default subject line')
    })
  })

  describe('when subject category is APPOINTMENTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.appointment)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Appointment: Default subject line')
    })
  })

  describe('when subject category is MEDICATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.medication)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Medication: Default subject line')
    })
  })

  describe('when subject category is TEST_RESULTS', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.test)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Test: Default subject line')
    })
  })

  describe('when subject category is EDUCATION', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.education)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Education: Default subject line')
    })
  })

  describe('when subject category is COVID', () => {
    it('should show correct text', async () => {
      initializeTestInstance(CategoryTypeFields.covid)
      expect(testInstance.findAllByType(TextView)[2].props.children).toBe('COVID: Default subject line')
    })
  })

  describe('pagination', () => {
    it('should call fetchInboxMessages for previous arrow', async () => {
      findByTestID(testInstance, 'previous-page').props.onPress()
      // was 2 now 1
      expect(fetchInboxMessages).toHaveBeenCalledWith(1, expect.anything())
    })

    it('should call fetchInboxMessages for next arrow', async () => {
      findByTestID(testInstance, 'next-page').props.onPress()
      // was 2 now 3
      expect(fetchInboxMessages).toHaveBeenCalledWith(3, expect.anything())
    })
  })
})
