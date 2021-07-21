import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import { Pressable } from 'react-native'

import PersonalInformationScreen from './index'
import { AddressData, BranchesOfServiceConstants, ServiceData, UserDataProfile } from 'store/api/types'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { ErrorComponent, LoadingComponent, TextView } from 'components'
import { profileAddressOptions } from '../AddressSummary'
import {
  ErrorsState,
  initialAuthorizedServicesState,
  initialAuthState,
  initialErrorsState, initializeErrorsByScreenID,
  initialMilitaryServiceState,
  initialPersonalInformationState
} from 'store/reducers'
import { CommonErrorTypesConstants } from 'constants/errors'
import { ScreenIDTypesConstants } from 'store/api/types/Screens'

let mockNavigationSpy = jest.fn(()=> {
  return jest.fn()
})
jest.mock('../../../utils/hooks', () => {
  let original = jest.requireActual("../../../utils/hooks")
  let theme = jest.requireActual("../../../styles/themes/standardTheme").default
  return {
    ...original,
    useTheme: jest.fn(()=> {
      return {...theme}
    }),
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
    serviceHistory: [{} as ServiceData]
  }
}

const personalInformationState = {
  ...initialPersonalInformationState,
  needsDataLoad: false
}

context('PersonalInformationScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let profile: UserDataProfile
  let props: any

  const initializeTestInstance = (loading = false, errorsState: ErrorsState = initialErrorsState) => {
    props = mockNavProps()
    profile = {
      firstName: 'Ben',
      middleName: 'J',
      lastName: 'Morgan',
      fullName: 'Ben J Morgan',
      contactEmail: { emailAddress: 'ben@gmail.com', id: '0' },
      signinEmail: 'ben@gmail.com',
      birthDate: '1990-05-08',
      gender: 'M',
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
      faxNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901286',
        phoneType: 'HOME',
        extension: '11111'
      },
      formattedFaxPhone: '(858)-690-1286',
    }

    store = mockStore({
      auth: {...initialAuthState},
      personalInformation: { 
        ...personalInformationState, 
        profile, 
        loading,    
      },
      errors: errorsState,
      authorizedServices: {
        ...initialAuthorizedServicesState,
        militaryServiceHistory: true,
      },
      militaryService: {
        ...initialMilitaryServiceState,
        serviceHistory: [{} as ServiceData]
      }
    })

    act(() => {
      component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
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
      initializeTestInstance(true)
      expect(testInstance.findByType(LoadingComponent)).toBeTruthy()
    })
  })

  describe('when profile does not exist', () => {
    it('should display empty string in the profile banner for the name', async () => {
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { ...personalInformationState }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('')
    })

    it('should not display string for most recent military branch in the profile banner', async () => {
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { ...personalInformationState }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Any updates you make here will also update in your VA.gov profile.')
    })
  })

  describe('when there is a birth date', () => {
    it('should display the birth date in the format Month day, year', async () => {
      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('May 08, 1990')
    })
  })

  describe('when there is no birth date', () => {
    it('should display the message This information is not available right now', async () => {
      profile.birthDate = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('This information is not available right now')
    })
  })

  describe('when there is a gender', () => {
    describe('when the gender is set to M', () => {
      it('should display the text to Male', async () => {
        expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Male')
      })
    })

    describe('when the gender is set to F', () => {
      it('should display the text to Female', async () => {
        profile.gender = 'F'

        store = mockStore({
          auth: {...initialAuthState},
          personalInformation: { 
            ...personalInformationState, 
            profile
          },
          ...authorizedMilitaryState
        })

        act(() => {
          component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
        })

        testInstance = component.root

        expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Female')
      })
    })
  })

  describe('when there is no gender', () => {
    it('should display the message This information is not available right now', async () => {
      profile.gender = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('This information is not available right now')
    })
  })

  describe('when there is a mailing address', () => {
    it('should display the full address', async () => {
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('1707 Tiburon Blvd, Address line 2, Address line 3')
      expect(testInstance.findAllByType(TextView)[12].props.children).toEqual('Tiburon, CA, 94920')
    })
  })

  describe('when there is no mailing address', () => {
    it('should display Add your mailing address', async () => {
      profile.mailingAddress = {} as AddressData
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState,
          profile
        },
        ...authorizedMilitaryState
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Add your mailing address')

      profile = {} as UserDataProfile
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Add your mailing address')
    })
  })

  describe('when there is a residential address', () => {
    it('should display the full address', async () => {
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('10 Laurel Way')
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual('Novato, CA, 94920')
    })
  })

  describe('when there is no residential address', () => {
    it('should display Add your home address', async () => {
      profile.residentialAddress = {} as AddressData
      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('Add your home address')
    })
  })

  describe('where is a home number', () => {
    it('should display the formatted home phone number', async () => {
      expect(testInstance.findAllByType(TextView)[18].props.children).toEqual('(858)-690-1289')
    })
  })

  describe('where is no home number', () => {
    it('should display the message Add your home phone number', async () => {
      profile.formattedHomePhone = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[18].props.children).toEqual('Add your home phone number')
    })
  })

  describe('where is a work number', () => {
    it('should display the formatted work phone number', async () => {
      expect(testInstance.findAllByType(TextView)[20].props.children).toEqual('(858)-690-1287')
    })
  })

  describe('where is no work number', () => {
    it('should display the message Add your work phone number', async () => {
      profile.formattedWorkPhone = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: {
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[20].props.children).toEqual('Add your work phone number')
    })
  })

  describe('where is a cell number', () => {
    it('should display the formatted cell phone number', async () => {
      expect(testInstance.findAllByType(TextView)[22].props.children).toEqual('(858)-690-1288')
    })
  })

  describe('where is no cell number', () => {
    it('should display the message Add your cell phone number', async () => {
      profile.formattedMobilePhone = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: {
          ...personalInformationState, 
          profile 
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[22].props.children).toEqual('Add your cell phone number')
    })
  })

  describe('where is a fax number', () => {
    it('should display the formatted fax number', async () => {
      expect(testInstance.findAllByType(TextView)[24].props.children).toEqual('(858)-690-1286, ext. 11111')
    })
  })

  describe('where is no fax number', () => {
    it('should display the message Add your fax number', async () => {
      profile.formattedFaxPhone = ''

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: { 
          ...personalInformationState, 
          profile
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[24].props.children).toEqual('Add your fax number')
    })
  })

  describe('when there is an email address', () => {
    it('should display the email address', async () => {
      expect(testInstance.findAllByType(TextView)[28].props.children).toEqual('ben@gmail.com')
    })
  })

  describe('when there is no email address', () => {
    it('should display Add your email address', async () => {
      profile.contactEmail = { emailAddress: '', id: '0' }

      store = mockStore({
        auth: {...initialAuthState},
        personalInformation: {
          ...personalInformationState, 
          profile,
        },
        ...authorizedMilitaryState
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[28].props.children).toEqual('Add your email address')
    })
  })

  describe('when mailing address is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(Pressable)[0].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditAddress', { displayTitle: 'Mailing address', addressType: profileAddressOptions.MAILING_ADDRESS })
    })
  })

  describe('when residential address is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(Pressable)[1].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditAddress', { displayTitle: 'Home address', addressType: profileAddressOptions.RESIDENTIAL_ADDRESS })
    })
  })

  describe('when common error occurs', () => {
    it('should render error component when the stores screenID matches the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.PERSONAL_INFORMATION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(1)
    })

    it('should not render error component when the stores screenID does not match the components screenID', async() => {
      const errorsByScreenID = initializeErrorsByScreenID()
      errorsByScreenID[ScreenIDTypesConstants.ASK_FOR_CLAIM_DECISION_SCREEN_ID] = CommonErrorTypesConstants.NETWORK_CONNECTION_ERROR

      const errorState: ErrorsState = {
        errorsByScreenID,
        tryAgain: () => Promise.resolve()
      }

      initializeTestInstance(false, errorState)
      expect(testInstance.findAllByType(ErrorComponent)).toHaveLength(0)
    })
  })
})
