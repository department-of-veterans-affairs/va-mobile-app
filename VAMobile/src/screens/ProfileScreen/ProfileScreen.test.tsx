import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {initialAuthState, initialMilitaryServiceState} from 'store/reducers'
import ProfileScreen from './index'
import { LoadingComponent } from 'components';

context('ProfileScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (directDepositBenefits: boolean = false, militaryInformationLoading = false): void => {
    store = mockStore({
      auth: {...initialAuthState},
      authorizedServices: {
        appeals: false,
        appointments: false,
        claims: false,
        directDepositBenefits: directDepositBenefits,
        lettersAndDocuments: false,
        militaryServiceHistory: false,
        userProfileUpdate: false,
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
    describe('when directDepositBenefits is true', () => {
      it('should be shown', async() => {
        initializeTestInstance(true)
        expect(testInstance.findByProps({ textLines: 'Direct deposit' })).toBeTruthy()
      })
    })
  })
})
