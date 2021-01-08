import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import { initialMilitaryServiceState } from 'store/reducers'
import ProfileScreen from './index'
import { LoadingComponent } from 'components';

context('ProfileScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (hasDirectDepositBenefits: boolean = false, militaryInformationLoading = false): void => {
    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      authorizedServices: {
        hasDirectDepositBenefits: hasDirectDepositBenefits
      },
      militaryService: { ...initialMilitaryServiceState, loading: militaryInformationLoading }
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

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(false, true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
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
