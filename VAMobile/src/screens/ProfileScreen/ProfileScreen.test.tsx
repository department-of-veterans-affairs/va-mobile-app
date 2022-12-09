import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { context, findByTestID, render, RenderAPI } from 'testUtils'
import { act, ReactTestInstance } from 'react-test-renderer'

import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialDisabilityRatingState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState,
} from 'store/slices'
import ProfileScreen from './index'
import { ErrorComponent, LoadingComponent } from 'components'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants, SigninServiceTypes, SigninServiceTypesConstants } from 'store/api/types'
import { defaultProfile } from 'utils/tests/profile'
import { waitFor } from '@testing-library/react-native'
import { when } from 'jest-when'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  const theme = jest.requireActual('../../styles/themes/standardTheme').default
  return {
    ...original,
    useTheme: jest.fn(() => {
      return { ...theme }
    }),
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

context('ProfileScreen', () => {
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let navigateToDirectDepositSpy: jest.Mock
  let navigateToHowToUpdateDirectDepositSpy: jest.Mock

  const initializeTestInstance = (
    directDepositBenefits: boolean = false,
    directDepositBenefitsUpdate: boolean = false,
    userProfileUpdate: boolean = false,
    militaryInformationLoading = false,
    errorState: ErrorsState = initialErrorsState,
    signinService: SigninServiceTypes = SigninServiceTypesConstants.IDME,
  ): void => {
    navigateToDirectDepositSpy = jest.fn()
    navigateToHowToUpdateDirectDepositSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('DirectDeposit')
      .mockReturnValue(navigateToDirectDepositSpy)
      .calledWith('HowToUpdateDirectDeposit')
      .mockReturnValue(navigateToHowToUpdateDirectDepositSpy)

    component = render(<ProfileScreen />, {
      preloadedState: {
        auth: { ...initialAuthState },
        authorizedServices: {
          ...initialAuthorizedServicesState,
          directDepositBenefits,
          directDepositBenefitsUpdate,
          userProfileUpdate,
        },
        militaryService: { ...initialMilitaryServiceState, loading: militaryInformationLoading },
        disabilityRating: {
          ...initialDisabilityRatingState,
          ratingData: {
            combinedDisabilityRating: 100,
            combinedEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            legalEffectiveDate: '2013-08-09T00:00:00.000+00:00',
            individualRatings: [],
          },
        },
        personalInformation: {
          ...initialPersonalInformationState,
          needsDataLoad: false,
          profile: {
            ...defaultProfile,
            signinService,
          },
        },
        errors: errorState,
      },
    })

    testInstance = component.container
  }

  it('initializes correctly', async () => {
    initializeTestInstance()
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      await waitFor(() => {
        initializeTestInstance(false, false, false, true)
        expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
      })
    })
  })

  describe('personal and contact information', () => {
    describe('when userProfileUpdate is true', () => {
      it('should be shown', async () => {
        await waitFor(() => {
          initializeTestInstance(false, false, true)
        })

        expect(findByTestID(testInstance, 'personal-and-contact-information')).toBeTruthy()
      })
    })
  })

  describe('disability rating', () => {
    describe('when user has disability ratings', () => {
      it('should be shown', async () => {
        await waitFor(() => {
          initializeTestInstance(true)
        })
        expect(findByTestID(testInstance, 'disability-rating')).toBeTruthy()
      })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PROFILE_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(true, undefined, undefined, undefined, errorState)

      await waitFor(() => {
        expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
      })
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      await waitFor(() => {
        initializeTestInstance(true, undefined, undefined, undefined, errorState)
      })
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
