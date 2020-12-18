import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import ProfileScreen from './index'

context('ProfileScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (hasDirectDepositBenefits: boolean = false): void => {
    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      authorizedServices: {
        hasDirectDepositBenefits: hasDirectDepositBenefits
      }
    })

    act(() => {
      component = renderWithProviders(<ProfileScreen/>, store)
    })

    testInstance = component.root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('direct deposit', () => {
    describe('when hasDirectDepositBenefits is true', () => {
      it('should be shown', async() => {
        initializeTestInstance(true)
        expect(testInstance.findByProps({ textLines: 'Direct deposit' })).toBeTruthy()
      })
    })
  })
})
