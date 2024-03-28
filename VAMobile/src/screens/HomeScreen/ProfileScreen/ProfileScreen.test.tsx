import React from 'react'

import { screen } from '@testing-library/react-native'

import { militaryServiceHistoryKeys } from 'api/militaryService'
import { personalInformationKeys } from 'api/personalInformation/queryKeys'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types'
import { ErrorsState, initialErrorsState, initializeErrorsByScreenID } from 'store/slices'
import { context, mockNavProps, render, waitFor } from 'testUtils'

import ProfileScreen from './ProfileScreen'

jest.mock('../../../api/authorizedServices/getAuthorizedServices', () => {
  const original = jest.requireActual('../../../api/authorizedServices/getAuthorizedServices')
  return {
    ...original,
    useAuthorizedServices: jest.fn().mockReturnValue({
      status: 'success',
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
        userProfileUpdate: false,
      },
    }),
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
  const initializeTestInstance = (errorState: ErrorsState = initialErrorsState): void => {
    const props = mockNavProps(undefined, {
      setOptions: jest.fn(),
      navigate: jest.fn(),
      addListener: jest.fn(),
    })

    const queriesData = [
      {
        queryKey: personalInformationKeys.personalInformation,
        data: {
          firstName: 'Gary',
          middleName: null,
          lastName: 'Washington',
          signinEmail: 'Gary.Washington@idme.com',
          signinService: 'IDME',
          fullName: 'Gary Washington',
          birthDate: null,
          hasFacilityTransitioningToCerner: false,
        },
      },
      {
        queryKey: militaryServiceHistoryKeys.serviceHistory,
        data: {
          serviceHistory: [],
        },
      },
    ]

    render(<ProfileScreen {...props} />, {
      preloadedState: {
        errors: errorState,
      },
      queriesData,
    })
  }

  describe('when userProfileUpdate is false, true would not work since mockReturnValueOnce would not work like the other screens so confirm true with demo mode', () => {
    it('it should only render military info and settings', async () => {
      initializeTestInstance()
      await waitFor(() => expect(screen.queryByText('Personal information')).toBeFalsy())
      await waitFor(() => expect(screen.queryByText('Contact information')).toBeFalsy())
      await waitFor(() => expect(screen.getByText('Military information')).toBeTruthy())
      await waitFor(() => expect(screen.getByText('Settings')).toBeTruthy())
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
      initializeTestInstance(errorState)

      expect(screen.getByText("The app can't be loaded.")).toBeTruthy()
    })
  })
})
