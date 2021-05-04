import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance, act } from 'react-test-renderer'

import {context, renderWithProviders} from 'testUtils'
import SignoutButton from './SignoutButton'
import {VAButton} from "./index";
import {logout} from "../store/actions";

jest.mock('store/actions', () => {
  let actual = jest.requireActual('store/actions')
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

  describe('when the button is pressed', () => {
    it('should trigger the signout action', async () => {
      act(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(logout).toHaveBeenCalled()
    })
  })

})
