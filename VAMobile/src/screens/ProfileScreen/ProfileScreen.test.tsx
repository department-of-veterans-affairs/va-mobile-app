import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {context, findByTestID, mockStore, renderWithProviders} from 'testUtils'
import {act, ReactTestInstance} from 'react-test-renderer'

import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialDisabilityRatingState,
  initialErrorsState, initializeErrorsByScreenID,
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
      disabilityRating: {
        ...initialDisabilityRatingState,
        ratingData: {
          combinedDisabilityRating: 100,
          combinedEffectiveDate: "2013-08-09T00:00:00.000+00:00",
          legalEffectiveDate: "2013-08-09T00:00:00.000+00:00",
          individualRatings : []   
        }
      },
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

  describe('disability rating', () => {
    describe('when user has disability ratings', () => {
      it('should be shown', async() => {
        initializeTestInstance(true)
        expect(findByTestID(testInstance, 'disability-rating')).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PROFILE_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(true, undefined, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(true, undefined, undefined, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
