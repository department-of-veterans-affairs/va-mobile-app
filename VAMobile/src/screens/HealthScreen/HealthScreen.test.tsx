import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, mockStore, renderWithProviders } from 'testUtils'
import { HealthScreen } from '../index'
import { Pressable, TouchableWithoutFeedback } from 'react-native'
import { initialAuthState, initialErrorsState, initialSecureMessagingState } from 'store'
import Inbox from './SecureMessaging/Inbox/Inbox'
import { LoadingComponent, TextView, MessagesCountTag } from 'components'

let mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  let original = jest.requireActual('utils/hooks')
  let theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return () => mockNavigationSpy
    },
  }
})

context('HealthScreen', () => {
  let component: any
  let props: any
  let store: any
  let testInstance: ReactTestInstance

  //mockList:  SecureMessagingMessageList --> for inboxMessages
  const initializeTestInstance = (unreadCount: number = 13, hasLoadedInbox: boolean = true) => {
    props = mockNavProps()

    store = mockStore({
      auth: { ...initialAuthState },
      secureMessaging: {
        ...initialSecureMessagingState,
        hasLoadedInbox,
        inbox: {
          type: 'Inbox',
          id: '123',
          attributes: {
            //SecureMessagingFolderAttributes
            folderId: 123,
            name: 'Inbox',
            count: 45,
            unreadCount: unreadCount,
            systemFolder: true,
          },
        },
      },
      errors: initialErrorsState,
    })

    act(() => {
      component = renderWithProviders(<HealthScreen {...props} />, store)
    })

    testInstance = component.root
  }
  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the crisis line button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the appointments button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the secure messaging button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the immunizations button', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(Pressable)[2].props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(undefined, false)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  it('should render messagesCountTag with the correct count number', async () => {
    expect(testInstance.findByType(MessagesCountTag)).toBeTruthy()
    expect(testInstance.findAllByType(TextView)[8].props.children).toBe(13)
  })

  describe('when there are zero unread inbox messages', () => {
    it('should not render a messagesCountTag', async () => {
      initializeTestInstance(0)
      expect(testInstance.findAllByType(TextView)[7].props.children).toBe('Messages')
      expect(testInstance.findAllByType(TextView)[8].props.children).toBe('Review and send secure messages')
    })
  })
})
