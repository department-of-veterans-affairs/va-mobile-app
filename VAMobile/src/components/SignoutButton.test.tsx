import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import SignoutButton from './SignoutButton'
import {VAButton} from "./index";

jest.mock('store/actions/auth', () => {
  let actual = jest.requireActual('store/actions/auth')
  return {
    ...actual,
    logout: jest.fn(() => {
      return {
        type: '',
        payload: ''
      }
    })
  }
})

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
      ...original,
      useDestructiveAlert: () => mockAlertSpy,
      useTheme: jest.fn(()=> {
        return {...theme}
    }),
  }
})


context('SignoutButton', () => {
  let component: any
  let testInstance: ReactTestInstance

  beforeEach(() => {
    act(() => {
      component = renderWithProviders(<SignoutButton />)
    })
    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the sign out button is pressed', () => {
    it('should call useDestructiveAlert', async () => {
      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
