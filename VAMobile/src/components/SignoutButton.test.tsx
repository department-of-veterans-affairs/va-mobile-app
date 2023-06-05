import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import 'jest-styled-components'
import { ReactTestInstance } from 'react-test-renderer'

import { context, render, RenderAPI, waitFor } from 'testUtils'
import SignoutButton from './SignoutButton'
import { VAButton } from './index'

jest.mock('store/slices', () => {
  let actual = jest.requireActual('store/slices')
  return {
    ...actual,
    logout: jest.fn(() => {
      return {
        type: '',
        payload: '',
      }
    }),
  }
})

const mockAlertSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('styles/themes/standardTheme').default
  return {
    ...original,
    useDestructiveAlert: () => mockAlertSpy,
  }
})

context('SignoutButton', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance

  beforeEach(() => {
    component = render(<SignoutButton />)

    testInstance = component.UNSAFE_root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when the sign out button is pressed', () => {
    it('should call useDestructiveAlert', async () => {
      await waitFor(() => {
        testInstance.findByType(VAButton).props.onPress()
      })

      expect(mockAlertSpy).toHaveBeenCalled()
    })
  })
})
