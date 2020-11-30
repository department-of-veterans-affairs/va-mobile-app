import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import { act, ReactTestInstance } from 'react-test-renderer'
import {TouchableWithoutFeedback} from 'react-native'

import PersonalInformationScreen from './index'
import { AddressData, UserDataProfile } from 'store/api/types'
import {context, mockNavProps, mockStore, renderWithProviders} from 'testUtils'
import { TextView } from 'components'
import { profileAddressOptions } from '../AddressSummary'

let mockNavigationSpy = jest.fn()
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

context('PersonalInformationScreen', () => {
  let store: any
  let component: any
  let testInstance: ReactTestInstance
  let profile: UserDataProfile
  let props: any

  beforeEach(() => {
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
        addressLine1: '10 Laurel Way',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Novato',
        countryCode: '1',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      },
      mailingAddress: {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'DOMESTIC',
        city: 'Tiburon',
        countryCode: '1',
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
      faxPhoneNumber: {
        id: 1,
        areaCode: '858',
        countryCode: '1',
        phoneNumber: '6901286',
        phoneType: 'HOME',
      },
      formattedFaxPhone: '(858)-690-1286',
    }

    store = mockStore({
      auth: { initializing: true, loggedIn: false, loading: false },
      personalInformation: { profile, loading: false }
    })

    act(() => {
      component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when profile does not exist', () => {
    it('should display empty strings in the profile banner for the name and most recent branch of service', async () => {
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[0].props.children).toEqual('')
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('')
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
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
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
          auth: { initializing: true, loggedIn: false, loading: false },
          personalInformation: { profile, loading: false }
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
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
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
    it('should display Please add your mailing address', async () => {
      profile.mailingAddress = {} as AddressData
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Please add your mailing address')

      profile = {} as UserDataProfile
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[11].props.children).toEqual('Please add your mailing address')
    })
  })

  describe('when there is a residential address', () => {
    it('should display the full address', async () => {
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('10 Laurel Way')
      expect(testInstance.findAllByType(TextView)[15].props.children).toEqual('Novato, CA, 94920')
    })
  })

  describe('when there is no residential address', () => {
    it('should display Please add your residential address', async () => {
      profile.residentialAddress = {} as AddressData
      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })
      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })
      testInstance = component.root
      expect(testInstance.findAllByType(TextView)[14].props.children).toEqual('Please add your residential address')
    })
  })

  describe('where is a home number', () => {
    it('should display the formatted home phone number', async () => {
      expect(testInstance.findAllByType(TextView)[18].props.children).toEqual('(858)-690-1289')
    })
  })

  describe('where is no home number', () => {
    it('should display the message Please add your home phone number', async () => {
      profile.formattedHomePhone = ''

      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[18].props.children).toEqual('Please add your home phone number')
    })
  })

  describe('where is a work number', () => {
    it('should display the formatted work phone number', async () => {
      expect(testInstance.findAllByType(TextView)[20].props.children).toEqual('(858)-690-1287')
    })
  })

  describe('where is no work number', () => {
    it('should display the message Please add your work phone number', async () => {
      profile.formattedWorkPhone = ''

      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[20].props.children).toEqual('Please add your work phone number')
    })
  })

  describe('where is a cell number', () => {
    it('should display the formatted cell phone number', async () => {
      expect(testInstance.findAllByType(TextView)[22].props.children).toEqual('(858)-690-1288')
    })
  })

  describe('where is no cell number', () => {
    it('should display the message Please add your cell phone number', async () => {
      profile.formattedMobilePhone = ''

      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[22].props.children).toEqual('Please add your cell phone number')
    })
  })

  describe('where is a fax number', () => {
    it('should display the formatted fax number', async () => {
      expect(testInstance.findAllByType(TextView)[24].props.children).toEqual('(858)-690-1286')
    })
  })

  describe('where is no fax number', () => {
    it('should display the message Please add your fax number', async () => {
      profile.formattedFaxPhone = ''

      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[24].props.children).toEqual('Please add your fax number')
    })
  })

  describe('when there is an email address', () => {
    it('should display the email address', async () => {
      expect(testInstance.findAllByType(TextView)[28].props.children).toEqual('ben@gmail.com')
    })
  })

  describe('when there is no email address', () => {
    it('should display Please add your email address', async () => {
      profile.contactEmail = { emailAddress: '', id: '0' }

      store = mockStore({
        auth: { initializing: true, loggedIn: false, loading: false },
        personalInformation: { profile, loading: false }
      })

      act(() => {
        component = renderWithProviders(<PersonalInformationScreen {...props} />, store)
      })

      testInstance = component.root

      expect(testInstance.findAllByType(TextView)[28].props.children).toEqual('Please add your email address')
    })
  })

  describe('when mailing address is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[2].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditAddress', { displayTitle: 'Mailing Address', addressType: profileAddressOptions.MAILING_ADDRESS })
    })
  })

  describe('when residential address is clicked', () => {
    it('should call navigation navigate', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[3].props.onPress()
      expect(mockNavigationSpy).toBeCalled()
      expect(mockNavigationSpy).toBeCalledWith('EditAddress', { displayTitle: 'Residential Address', addressType: profileAddressOptions.RESIDENTIAL_ADDRESS })
    })
  })
})
