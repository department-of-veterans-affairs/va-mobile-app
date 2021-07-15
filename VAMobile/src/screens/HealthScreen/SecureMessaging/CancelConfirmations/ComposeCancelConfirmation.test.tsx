import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import { context, mockNavProps, renderWithProviders } from 'testUtils'
import ComposeCancelConfirmation from './ComposeCancelConfirmation'
import { resetSaveDraftFailed, resetSaveDraftComplete, resetHasLoadedRecipients, resetSendMessageFailed, updateSecureMessagingTab } from 'store/actions'
import { TouchableWithoutFeedback } from 'react-native'

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

jest.mock('store/actions', () => {
  let actual = jest.requireActual('store/actions')
  return {
    ...actual,
    updateSecureMessagingTab: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
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
    resetSaveDraftComplete: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
    resetSaveDraftFailed: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

context('ComposeCancelConfirmation', () => {
  let component: any
  let testInstance: ReactTestInstance
  let props: any
  let goBack: jest.Mock
  let navigateSpy: jest.Mock

  beforeEach(() => {
    goBack = jest.fn()
    navigateSpy = jest.fn()

    props = mockNavProps(undefined, { navigate: navigateSpy, setOptions: jest.fn(), goBack }, { params: { header: '' } })

    act(() => {
      component = renderWithProviders(<ComposeCancelConfirmation {...props} />)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('on click of the crisis line banner', () => {
    it('should call useRouteNavigation', async () => {
      testInstance.findByType(TouchableWithoutFeedback).props.onPress()
      expect(mockNavigationSpy).toHaveBeenCalled()
    })
  })

  describe('on click of the go to inbox button', () => {
    it('should call navigate, updateSecureMessagingTab, resetSaveDraftComplete, resetSaveDraftFailed, and resetSendMessageFailed', async () => {
      testInstance.findByProps({ label: 'Cancel and go to Inbox' }).props.onPress()
      expect(navigateSpy).toHaveBeenCalled()
      expect(resetSendMessageFailed).toHaveBeenCalled()
      expect(updateSecureMessagingTab).toHaveBeenCalled()
      expect(resetHasLoadedRecipients).toHaveBeenCalled()
      expect(resetSaveDraftComplete).toHaveBeenCalled()
      expect(resetSaveDraftFailed).toHaveBeenCalled()
    })
  })

  describe('on click of the "Go back to editing" button', () => {
    it('should call navigation goBack', async () => {
      testInstance.findByProps({ label: 'Go back to editing' }).props.onPress()
      expect(goBack).toHaveBeenCalled()
    })
  })
})
