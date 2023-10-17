import 'react-native'
import React from 'react'

import { context, mockNavProps, render, waitFor } from 'testUtils'
import { screen } from '@testing-library/react-native'
import {
  ErrorsState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
} from 'store/slices'
import ProfileScreen from './ProfileScreen'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  let original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: "success",
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
    })
  }
})

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
        errors: errorState,
      },
    })
  }

  describe('when userProfileUpdate is false, true would not work since mockReturnValueOnce would not work like the other screens so confirm true with demo mode', () => {
    it('it should only render military info and settings', async () => {
      await waitFor(() => {
        initializeTestInstance()
      })
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
