import 'react-native'
import React from 'react'
// Note: test renderer must be required after react-native.
import {act, ReactTestInstance} from 'react-test-renderer'
import { context, mockStore, renderWithProviders } from 'testUtils'

import AddressSummary, {addressDataField, profileAddressOptions} from './AddressSummary'
import Mock = jest.Mock
import {AddressData, UserDataProfile} from 'store/api/types'
import { TextView } from 'components'
import { InitialState } from 'store/reducers'
import {TouchableWithoutFeedback} from 'react-native'

const initializeWithUpdatedData = (component: any, profile: UserDataProfile, addressData: Array<addressDataField>): ReactTestInstance => {
  const store = mockStore({
    ...InitialState,
    personalInformation: { ...InitialState.personalInformation, profile }
  })

  act(() => {
    component = renderWithProviders(<AddressSummary addressData={addressData} />, store)
  })

  return component.root
}

context('AddressSummary', () => {
  let store: any
  let component: any
  let addressData: any
  let onPressSpy: Mock
  let onPressSpy2: Mock
  let testInstance: ReactTestInstance
  let profile: UserDataProfile

  beforeEach(() => {
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
      mostRecentBranch: '',
    }

    onPressSpy = jest.fn()
    onPressSpy2 = jest.fn()

    addressData = [
      { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onPressSpy },
      { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onPressSpy2 },
    ]

    store = mockStore({
      ...InitialState,
      personalInformation: { ...InitialState.personalInformation, profile }
    })

    act(() => {
      component = renderWithProviders(<AddressSummary addressData={addressData} />, store)
    })

    testInstance = component.root
  })

  it('initializes correctly', async () => {
    expect(component).toBeTruthy()
  })

  describe('when there is a mailing address', () => {
    it('should display the full address', async () => {
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('1707 Tiburon Blvd')
      expect(testInstance.findAllByType(TextView)[2].props.children).toEqual('Address line 2')
      expect(testInstance.findAllByType(TextView)[3].props.children).toEqual('Address line 3')
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Tiburon, CA, 94920')
    })
  })

  describe('when there is no mailing address', () => {
    it('should display Please add your mailing address', async () => {
      profile.mailingAddress = {} as AddressData
      testInstance = initializeWithUpdatedData(component, profile, addressData)
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please add your mailing address')

      profile = {} as UserDataProfile
      testInstance = initializeWithUpdatedData(component, profile, addressData)
      expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please add your mailing address')
    })
  })

  describe('when there is a residential address', () => {
    it('should display the full address', async () => {
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('10 Laurel Way')
      expect(testInstance.findAllByType(TextView)[7].props.children).toEqual('Novato, CA, 94920')
    })
  })

  describe('when there is no residential address', () => {
    it('should display Please add your residential address', async () => {
      profile.residentialAddress = {} as AddressData
      testInstance = initializeWithUpdatedData(component, profile, addressData)
      expect(testInstance.findAllByType(TextView)[6].props.children).toEqual('Please add your residential address')
    })
  })

  describe('when the addressType is DOMESTIC', () => {
    it('should display the last line as CITY, STATE, ZIP', async () => {
      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Tiburon, CA, 94920')
    })
  })

  describe('when the addressType is OVERSEAS MILITARY', () => {
    describe('when the city exists', () => {
      it('should display the last line as CITY, STATE ZIP', async () => {
        profile.mailingAddress = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCode: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        testInstance = initializeWithUpdatedData(component, profile, addressData)

        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Tiburon, CA 94920')
      })
    })

    describe('when the city does not exist', () => {
      it('should display the last line as STATE ZIP', async () => {
        profile.mailingAddress = {
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: '',
          countryCode: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'CA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        testInstance = initializeWithUpdatedData(component, profile, addressData)

        expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('CA 94920')
      })
    })
  })

  describe('when the addressType is INTERNATIONAL', () => {
    it('should display the second to last line as CITY, INTERNATIONAL_POSTAL_CODE', async () => {
      profile.mailingAddress = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Tiburon',
        countryCode: '1',
        internationalPostalCode: 'London',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }
      testInstance = initializeWithUpdatedData(component, profile, addressData)

      expect(testInstance.findAllByType(TextView)[4].props.children).toEqual('Tiburon, London')
    })

    it('should display the country code on the last line if it exists', async () => {
      profile.mailingAddress = {
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Tiburon',
        countryCode: 'Spain',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }
      testInstance = initializeWithUpdatedData(component, profile, addressData)

      expect(testInstance.findAllByType(TextView)[5].props.children).toEqual('Spain')
    })

    describe('when there is no country code', () => {
      it('should display Please add your mailing address', async () => {
        profile.mailingAddress = {
          addressLine1: '',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: '',
          countryCode: '',
          internationalPostalCode: '',
          province: '',
          stateCode: '',
          zipCode: '',
          zipCodeSuffix: '',
        }
        testInstance = initializeWithUpdatedData(component, profile, addressData)

        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Please add your mailing address')
      })
    })

    describe('when only the country code exists', () => {
      it('should only display the country code', async () => {
        profile.mailingAddress = {
          addressLine1: '',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: '',
          countryCode: 'Spain',
          internationalPostalCode: '',
          province: '',
          stateCode: '',
          zipCode: '',
          zipCodeSuffix: '',
        }
        testInstance = initializeWithUpdatedData(component, profile, addressData)

        expect(testInstance.findAllByType(TextView)[1].props.children).toEqual('Spain')
      })
    })
  })

  describe('when the address summary is clicked', () => {
    it('should call onPress', async () => {
      testInstance.findAllByType(TouchableWithoutFeedback)[0].props.onPress()
      expect(onPressSpy).toBeCalled()

      testInstance.findAllByType(TouchableWithoutFeedback)[1].props.onPress()
      expect(onPressSpy2).toBeCalled()
    })
  })
})
