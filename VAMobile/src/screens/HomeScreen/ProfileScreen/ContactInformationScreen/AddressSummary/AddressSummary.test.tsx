import 'react-native'
import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { context, render } from 'testUtils'
import AddressSummary, { addressDataField, profileAddressOptions } from './AddressSummary'
import Mock = jest.Mock
import { AddressData, UserDataProfile } from 'store/api/types'
import { InitialState } from 'store/slices'

context('AddressSummary', () => {
  let addressData: any
  let onPressSpy: Mock
  let onPressSpy2: Mock
  let profile: UserDataProfile
  const initializeTestInstance = (profile: UserDataProfile, addressData: Array<addressDataField>) => {
    render(<AddressSummary addressData={addressData} />, {
      preloadedState: {
        ...InitialState,
        personalInformation: { ...InitialState.personalInformation, profile },
      },
    })
  }

  beforeEach(() => {
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

    onPressSpy = jest.fn()
    onPressSpy2 = jest.fn()

    addressData = [
      { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: onPressSpy },
      { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: onPressSpy2 },
    ]
    initializeTestInstance(profile, addressData)
  })

  describe('when there are addresses', () => {
    it('should display the full address', async () => {
      expect(screen.getByText('Mailing address')).toBeTruthy()
      expect(screen.getByText('1707 Tiburon Blvd, Address line 2, Address line 3')).toBeTruthy()
      expect(screen.getByText('Tiburon, CA, 94920')).toBeTruthy()
      expect(screen.getByText('Home address')).toBeTruthy()
      expect(screen.getByText('10 Laurel Way')).toBeTruthy()
      expect(screen.getByText('Novato, CA, 94920')).toBeTruthy()
    })
  })

  describe('when the address summary is clicked', () => {
    it('should call onPress', async () => {
      fireEvent.press(screen.getByTestId("Mailing address 1707 Tiburon Blvd, Address line 2, Address line 3 Tiburon, CA, 94920"))
      expect(onPressSpy).toBeCalled()

      fireEvent.press(screen.getByTestId("Home address 10 Laurel Way Novato, CA, 94920"))
      expect(onPressSpy2).toBeCalled()
    })
  })

  describe('when there is no address', () => {
    it('should display Add your address for mailing or home based off which one is missing', async () => {
      profile.mailingAddress = {} as AddressData
      initializeTestInstance(profile, addressData)
      expect(screen.getByText('Add your mailing address')).toBeTruthy()

      profile.residentialAddress = {} as AddressData
      initializeTestInstance(profile, addressData)
      expect(screen.getByText('Add your home address')).toBeTruthy()

      profile = {} as UserDataProfile
      initializeTestInstance(profile, addressData)
      expect(screen.getByText('Add your mailing address')).toBeTruthy()
      expect(screen.getByText('Add your home address')).toBeTruthy()
    })
  })

  describe('when the addressType is OVERSEAS MILITARY', () => {
    describe('when the city exists', () => {
      it('should display the last line as CITY, STATE ZIP', async () => {
        profile.mailingAddress = {
          id: 1,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: 'Tiburon',
          countryCodeIso3: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'AA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance(profile, addressData)
        expect(screen.getByText('Tiburon, Armed Forces Americas (AA) 94920')).toBeTruthy()
      })
    })

    describe('when the city does not exist', () => {
      it('should display the last line as STATE ZIP', async () => {
        profile.mailingAddress = {
          id: 1,
          addressLine1: '1707 Tiburon Blvd',
          addressLine2: 'Address line 2',
          addressLine3: 'Address line 3',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'OVERSEAS MILITARY',
          city: '',
          countryCodeIso3: '1',
          internationalPostalCode: '1',
          province: 'province',
          stateCode: 'AA',
          zipCode: '94920',
          zipCodeSuffix: '1234',
        }
        initializeTestInstance(profile, addressData)
        expect(screen.getByText('Armed Forces Americas (AA) 94920')).toBeTruthy()
      })
    })
  })

  describe('when the addressType is INTERNATIONAL', () => {
    it('should display the second to last line as CITY, STATE, INTERNATIONAL_POSTAL_CODE and country code on last line if it exists', async () => {
      profile.mailingAddress = {
        id: 1,
        addressLine1: '127 Harvest Moon Dr',
        addressLine2: '',
        addressLine3: '',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Bolton',
        countryCodeIso3: 'ESP',
        internationalPostalCode: 'L7E 2W1',
        province: 'Ontario',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }
      initializeTestInstance(profile, addressData)
      expect(screen.getByText('Bolton, Ontario, L7E 2W1')).toBeTruthy()
      expect(screen.getByText('Spain')).toBeTruthy()
    })

    describe('when there is no country code', () => {
      it('should display Add your mailing address', async () => {
        profile.mailingAddress = {
          id: 1,
          addressLine1: '',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: '',
          countryCodeIso3: '',
          internationalPostalCode: '',
          province: '',
          stateCode: '',
          zipCode: '',
          zipCodeSuffix: '',
        }
        initializeTestInstance(profile, addressData)
        expect(screen.getByText('Add your mailing address')).toBeTruthy()
      })
    })

    describe('when only the country code exists', () => {
      it('should only display the country code', async () => {
        profile.mailingAddress = {
          id: 1,
          addressLine1: '',
          addressPou: 'RESIDENCE/CHOICE',
          addressType: 'INTERNATIONAL',
          city: '',
          countryCodeIso3: 'ESP',
          internationalPostalCode: '',
          province: '',
          stateCode: '',
          zipCode: '',
          zipCodeSuffix: '',
        }
        initializeTestInstance(profile, addressData)
        expect(screen.getByText('Spain')).toBeTruthy()
      })
    })
  })
})
