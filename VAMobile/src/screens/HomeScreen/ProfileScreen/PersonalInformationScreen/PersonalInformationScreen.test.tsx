import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { ReactTestInstance } from 'react-test-renderer'

import PersonalInformationScreen from './index'
import { BranchesOfServiceConstants, ServiceData, UserDataProfile, UserDemographics } from 'store/api/types'
import { context, mockNavProps, render, RenderAPI, waitFor } from 'testUtils'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialErrorsState,
  initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState,
} from 'store/slices'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'
import { when } from 'jest-when'

let mockNavigationSpy = jest.fn()
jest.mock('../../../../utils/hooks', () => {
  let original = jest.requireActual('../../../../utils/hooks')
  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

const authorizedMilitaryState = {
  authorizedServices: {
    ...initialAuthorizedServicesState,
    militaryServiceHistory: true,
  },
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
  let demographics: UserDemographics
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
      contactEmail: { emailAddress: 'ben@gmail.com', id: '0' },
      signinEmail: 'ben@gmail.com',
      birthDate: '1990-05-08',
      addresses: '',
      residentialAddress: {
        id: 1,
        addressLine1: '10 Laurel Way',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Novato',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      },
      mailingAddress: {
        id: 2,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Tiburon',
        countryCodeIso3: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      },
      homePhoneNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901289',
        phoneType: 'HOME',
      },
      formattedHomePhone: '(858)-690-1289',
      mobilePhoneNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901288',
        phoneType: 'HOME',
      },
      formattedMobilePhone: '(858)-690-1288',
      workPhoneNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901287',
        phoneType: 'HOME',
      },
      formattedWorkPhone: '(858)-690-1287',
      signinService: 'IDME',
    }

    demographics = {
      genderIdentity: 'M',
      preferredName: 'Benny'
    }

    store = {
      auth: { ...initialAuthState },
      personalInformation: {
        ...personalInformationState,
        profile,
        demographics,
        loading,
      },
      errors: errorsState,
      authorizedServices: {
        ...initialAuthorizedServicesState,
        militaryServiceHistory: true,
      },
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
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('May 08, 1990')
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

      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('This information is not available right now')
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
