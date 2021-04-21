import 'react-native'
import React from 'react'
import {Pressable} from "react-native";
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import Inbox from './Inbox'
import NoInboxMessages from '../NoInboxMessages/NoInboxMessages'
import {CategoryTypeFields, SecureMessagingMessageData, SecureMessagingMessageList} from 'store/api/types'
import {initialAuthState, initialErrorsState, initialSecureMessagingState} from "store";
import {LoadingComponent, TextView} from 'components'


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

const mockMessages: Array<SecureMessagingMessageData> = [
  {
    type: 'test',
    id: 1,
    attributes: {
      messageId: 1,
      category: CategoryTypeFields.appointment,
      subject: 'I would like to reschedule',
      body: 'test',
      attachment: false,
      sentDate: '1-1-21',
      senderId: 2,
      senderName: 'mock sender',
      recipientId: 3,
      recipientName: 'mock recipient name',
      readReceipt: 'mock read receipt'
    }
  },
  {
    type: 'test',
    id: 2,
    attributes: {
      messageId: 2,
      category: CategoryTypeFields.covid,
      subject: '',
      body: 'test',
      attachment: true,
      sentDate: '1-1-21',
      senderId: 2,
      senderName: 'mock sender',
      recipientId: 3,
      recipientName: 'mock recipient name',
      readReceipt: 'mock read receipt'
    }
  },
  {
    type: 'test',
    id: 3,
    attributes: {
      messageId: 3,
      category: CategoryTypeFields.other,
      subject: 'other should become general',
      body: 'test',
      attachment: false,
      sentDate: '1-1-21',
      senderId: 2,
      senderName: 'mock sender',
      recipientId: 3,
      recipientName: 'mock recipient name',
      readReceipt: 'mock read receipt'
    }
  }
]

context('Inbox', () => {
  let component: any
  let store: any
  let props: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (mockList: SecureMessagingMessageList, loading: boolean = false) => {
    props = mockNavProps()

    store = mockStore({
      auth: {...initialAuthState},
      secureMessaging: {
        ...initialSecureMessagingState,
        loading: loading,
        inboxMessages: mockList,
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
    initializeTestInstance(mockMessages)
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
      initializeTestInstance([], true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('should display correct format for subject category and subject line', async () => {
    expect(testInstance.findAllByType(TextView)[2].props.children).toBe('Appointment: I would like to reschedule')
    expect(testInstance.findAllByType(TextView)[5].props.children).toBe('COVID')
    expect(testInstance.findAllByType(TextView)[8].props.children).toBe('General: other should become general')
  })

})
