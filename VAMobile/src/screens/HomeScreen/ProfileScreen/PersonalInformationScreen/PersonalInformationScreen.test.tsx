import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'
import { screen } from '@testing-library/react-native'
import { when } from 'jest-when'

import PersonalInformationScreen from './index'
import { BranchesOfServiceConstants, ServiceData, UserDataProfile } from 'store/api/types'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { ErrorComponent, LoadingComponent } from 'components'
import {
  ErrorsState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState,
} from 'store/slices'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('../../../../api/demographics/getDemographics', () => {
  let original = jest.requireActual('../../../../api/demographics/getDemographics')
  return {
    ...original,
    useDemographics: () => ({
      status: "success",
      data: {
        genderIdentity: '',
        preferredName: '',
      }
    }),
  }
})

const authorizedMilitaryState = {
  militaryService: {
    ...initialMilitaryServiceState,
    mostRecentBranch: BranchesOfServiceConstants.AirForce,
    serviceHistory: [{} as ServiceData],
  },
}

const personalInformationState = {
  ...initialPersonalInformationState,
  needsDataLoad: false,
}

context('PersonalInformationScreen', () => {
  let store: any
  let component: RenderAPI
  let testInstance: ReactTestInstance
  let profile: UserDataProfile
  let props: any
  let navigateToResidentialAddressSpy: jest.Mock
  let navigateToMailingAddressSpy: jest.Mock

  const initializeTestInstance = (loading = false, errorsState: ErrorsState = initialErrorsState) => {
    navigateToMailingAddressSpy = jest.fn()
    navigateToResidentialAddressSpy = jest.fn()

    when(mockNavigationSpy)
      .mockReturnValue(() => {})
      .calledWith('EditAddress', { displayTitle: 'Mailing address', addressType: 'mailingAddress' })
      .mockReturnValue(navigateToMailingAddressSpy)
      .calledWith('EditAddress', { displayTitle: 'Home address', addressType: 'residentialAddress' })
      .mockReturnValue(navigateToResidentialAddressSpy)

    props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
      {
        params: {},
      },
    )

    profile = {
      preferredName: '',
      firstName: 'Ben',
      middleName: 'J',
      lastName: 'Morgan',
      fullName: 'Ben J Morgan',
      genderIdentity: '',
      signinEmail: 'ben@gmail.com',
      birthDate: '1990-05-08',
      signinService: 'IDME',
    }

    store = {
      auth: { ...initialAuthState },
      personalInformation: {
        ...personalInformationState,
        profile,
        loading,
      },
      errors: errorsState,
      militaryService: {
        ...initialMilitaryServiceState,
        serviceHistory: [{} as ServiceData],
      },
    }

    component = render(<PersonalInformationScreen {...props} />, { preloadedState: store })

    testInstance = component.UNSAFE_root
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when loading is set to true', () => {
    it('should show loading screen', async () => {
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when there is a birth date', () => {
    it('should display the birth date in the format Month day, year', async () => {
      expect(screen.queryByText('May 08, 1990')).toBeTruthy()
    })
  })

  describe('when there is no birth date', () => {
    it('should display the message This information is not available right now', async () => {
      profile.birthDate = ''

      store = {
        auth: { ...initialAuthState },
        personalInformation: {
          ...personalInformationState,
          profile,
        },
        ...authorizedMilitaryState,
      }

      await waitFor(() => {
        component = render(<PersonalInformationScreen {...props} />, { preloadedState: store })
      })

      testInstance = component.UNSAFE_root

      expect(screen.queryByText('This information is not available right now')).toBeTruthy()
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async () => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        ...initialErrorsState,
        errorsByScreenID,
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
