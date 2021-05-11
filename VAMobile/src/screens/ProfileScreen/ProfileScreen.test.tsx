import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, findByTestID, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialErrorsState,
  initialMilitaryServiceState
} from 'store/reducers'
import ProfileScreen from './index'
import { ErrorComponent, LoadingComponent } from 'components';
import { CommonErrorTypesConstants } from 'constants/errors'
import {ScreenIDTypesConstants} from 'store/api/types'

context('ProfileScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance

  const initializeTestInstance = (directDepositBenefits: boolean = false, userProfileUpdate: boolean = false, militaryInformationLoading = false, errorState: ErrorsState = initialErrorsState): void => {
    store = mockStore({
      auth: {...initialAuthState},
      authorizedServices: {
        ...initialAuthorizedServicesState,
        directDepositBenefits: directDepositBenefits,
        userProfileUpdate: userProfileUpdate,
      },
      militaryService: { ...initialMilitaryServiceState, loading: militaryInformationLoading },
      errors: errorState
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
      initializeTestInstance(false, false, true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('direct deposit', () => {
    describe('when directDepositBenefits is true', () => {
      it('should be shown', async() => {
        initializeTestInstance(true)
        expect(findByTestID(testInstance, 'direct-deposit-information')).toBeTruthy()
      })
    })
  })

  describe('personal and contact information', () => {
    describe('when userProfileUpdate is true', () => {
      it('should be shown', async() => {
        initializeTestInstance(false, true)
        expect(findByTestID(testInstance, 'personal-and-contact-information')).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: ScreenIDTypesConstants.PROFILE_SCREEN_ID,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(true, undefined, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorState: ErrorsState = {
        screenID: undefined,
        errorType: CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(true, undefined, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
