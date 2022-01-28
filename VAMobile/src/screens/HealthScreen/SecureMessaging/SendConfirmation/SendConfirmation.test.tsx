import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, waitFor, realStore, render, RenderAPI } from 'testUtils'
import SendConfirmation from './SendConfirmation'
import { TouchableWithoutFeedback } from 'react-native'
import { initialAuthState, initialErrorsState, initialSecureMessagingState, resetHasLoadedRecipients, resetSendMessageComplete } from 'store/slices'
import { AlertBox, LoadingComponent } from 'components'
import { CategoryTypeFields } from 'store/api/types'

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

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    resetSendMessageFailed: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetHasLoadedRecipients: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetSendMessageComplete: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('SendConfirmation', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let navigate: jest.Mock

  const initializeTestInstance = (loading = false, sendMessageComplete: boolean = false, sendMessageFailed: boolean = false, replyTriageError: boolean = false) => {
    goBack = jest.fn()
    navigate = jest.fn()

    const messageData = {
      recipient_id: 1,
      category: CategoryTypeFields.general,
      subject: 'Subject',
      body: 'message text',
    }

    props = mockNavProps(undefined, { setOptions: jest.fn(), goBack, navigate }, { params: { originHeader: '', messageData } })

    component = render(<SendConfirmation {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        secureMessaging: {
          ...initialSecureMessagingState,
          sendingMessage: loading,
          sendMessageComplete: sendMessageComplete,
          sendMessageFailed: sendMessageFailed,
          replyTriageError: replyTriageError,
        },

        errors: initialErrorsState,
      },
    })

    testInstance = component.container
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    await waitFor(() => {
      expect(component).toBeTruthy()
    })
  })

  it('should not display error alert before send button is clicked', async () => {
    await waitFor(() => {
      testInstance.findByType(AlertBox) // Only the send confirmation alert box should display
    })
  })

  it('should not have sendMessageFailed as true before send button is clicked', async () => {
    await waitFor(() => {
      const store = realStore()
      const { secureMessaging } = store.getState()
      expect(secureMessaging.sendMessageFailed).toEqual(false)
    })
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      await waitFor(() => {
        expect(mockNavigationSpy).toHaveBeenCalled()
      })
    })
  })

  describe('on click of the "Go back to editing" button', () => {
    it('should call navigation goBack and reset sendMessageFailed attribute', async () => {
      await waitFor(() => {
        testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
        expect(goBack).toHaveBeenCalled()
      })
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('when message is sent', () => {
    it('should call useRouteNavigation', async () => {
      initializeTestInstance(false, true)
      await waitFor(() => {
        expect(navigate).toHaveBeenCalled()
        expect(resetSendMessageComplete).toHaveBeenCalled()
        expect(resetHasLoadedRecipients).toHaveBeenCalled()
      })
    })
  })

  describe('when message send fails', () => {
    it('should call navigation goBack', async () => {
      initializeTestInstance(false, false, true)
      await waitFor(() => {
        expect(goBack).toHaveBeenCalled()
      })
    })
  })

  describe('when message reply fails because of triage error', () => {
    it('should call useRouteNavigation', async () => {
      initializeTestInstance(false, false, true, true)
      await waitFor(() => {
        expect(navigate).toHaveBeenCalled()
      })
    })
  })
})
