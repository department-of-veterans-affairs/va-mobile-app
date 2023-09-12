import 'react-native'
import React from 'react'

import { context, mockNavProps, render } from 'testUtils'
import { screen } from '@testing-library/react-native'
import {
  ErrorsState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState,
} from 'store/slices'
import ProfileScreen from './ProfileScreen'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => {
      return mockNavigationSpy
    },
  }
})

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: false
      }
    }).mockReturnValueOnce({
      data: {
        appeals: true,
        appointments: true,
        claims: true,
        decisionLetters: true,
        directDepositBenefits: true,
        directDepositBenefitsUpdate: true,
        disabilityRating: true,
        genderIdentity: true,
        lettersAndDocuments: true,
        militaryServiceHistory: true,
        paymentHistory: true,
        preferredName: true,
        prescriptions: true,
        scheduleAppointments: true,
        secureMessaging: true,
        userProfileUpdate: true
      }
    }),
  }
})

context('ProfileScreen', () => {
  let props: any

  const initializeTestInstance = ( militaryInformationLoading = false, errorState: ErrorsState = initialErrorsState ): void => {

    props = mockNavProps(undefined,
      {
        setOptions: jest.fn(),
        navigate: jest.fn(),
        addListener: jest.fn(),
      }
    )

    render(<ProfileScreen {...props} />, {
      preloadedState: {
        auth: { ...initialAuthState },
        militaryService: { ...initialMilitaryServiceState, loading: militaryInformationLoading },
        personalInformation: {
          ...initialPersonalInformationState,
          needsDataLoad: false,
        },
        errors: errorState,
      },
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  describe('when userProfileUpdate is true', () => {
    it('is should render all 4 options', async () => {
      expect(screen.getByText('Personal information')).toBeTruthy()
      expect(screen.getByText('Contact information')).toBeTruthy()
      expect(screen.getByText('Military information')).toBeTruthy()
      expect(screen.getByText('Settings')).toBeTruthy()
    })
  })

  describe('when userProfileUpdate is false', () => {
    it('it should only render military info and settings', async () => {
      expect(screen.queryByText('Personal information')).toBeFalsy()
      expect(screen.queryByText('Contact information')).toBeFalsy()
      expect(screen.getByText('Military information')).toBeTruthy()
      expect(screen.getByText('Settings')).toBeTruthy()
    })
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(screen.getByText('Loading your profile...')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PROFILE_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }
      initializeTestInstance(undefined, errorState)

      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
