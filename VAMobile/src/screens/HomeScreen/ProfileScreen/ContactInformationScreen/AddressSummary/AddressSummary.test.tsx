import React from 'react'
import { fireEvent, screen } from '@testing-library/react-native'

import { QueriesData, render } from 'testUtils'
import AddressSummary, { addressDataField, profileAddressOptions } from './AddressSummary'
import { AddressData, UserContactInformation } from 'api/types'
import { contactInformationKeys } from 'api/contactInformation/queryKeys'

const mailingAddressOnPressSpy = jest.fn()
const residentialAddressOnPressSpy = jest.fn()
const addressTypes: addressDataField[] = [
  { addressType: profileAddressOptions.MAILING_ADDRESS, onPress: mailingAddressOnPressSpy },
  { addressType: profileAddressOptions.RESIDENTIAL_ADDRESS, onPress: residentialAddressOnPressSpy },
]

const residentialAddress: AddressData = {
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
}
const mailingAddress: AddressData = {
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
}

describe('AddressSummary', () => {
  const renderWithData = (contactInformation?: Partial<UserContactInformation>) => {
    let queriesData: QueriesData | undefined

    if (contactInformation) {
      queriesData = [{
        queryKey: contactInformationKeys.contactInformation,
        data: {
          ...contactInformation
        }
      }]
    }

    render(<AddressSummary addressData={addressTypes} />, {queriesData})
  }

  beforeEach(() => {
    renderWithData()
  })

  describe('when there is a mailing address', () => {
    it('displays the full address', () => {
      renderWithData({residentialAddress, mailingAddress})
      expect(screen.getByText('1707 Tiburon Blvd, Address line 2, Address line 3')).toBeTruthy()
      expect(screen.getByText('Tiburon, CA, 94920')).toBeTruthy()
    })
  })

  describe('when there is no mailing address', () => {
    it('displays the message for adding a mailing address', () => {
      expect(screen.getByText('Add your mailing address')).toBeTruthy()
    })
  })

  describe('when there is a residential address', () => {
    it('displays the full address', () => {
      renderWithData({residentialAddress, mailingAddress})
      expect(screen.getByText('10 Laurel Way')).toBeTruthy()
      expect(screen.getByText('Novato, CA, 94920')).toBeTruthy()
    })
  })

  describe('when there is no residential address', () => {
    it('displays the message for adding a home address', () => {
      renderWithData()
      expect(screen.getByText('Add your home address')).toBeTruthy()
    })
  })

  describe('when the addressType is DOMESTIC', () => {
    it('displays the last line as CITY, STATE, ZIP', () => {
      renderWithData({residentialAddress, mailingAddress})
      expect(screen.getByText('Tiburon, CA, 94920')).toBeTruthy()
    })
  })

  describe('when the addressType is OVERSEAS MILITARY', () => {
    describe('when the city exists', () => {
      it('displays the last line as CITY, STATE ZIP', () => {
        const mailingAddress: AddressData = {
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

        renderWithData({mailingAddress})

        expect(screen.getByText('Tiburon, Armed Forces Americas (AA) 94920')).toBeTruthy()
      })
    })

    describe('when the city does not exist', () => {
      it('displays the last line as STATE ZIP', () => {
        const mailingAddress: AddressData = {
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

        renderWithData({mailingAddress})

        expect(screen.getByText('Armed Forces Americas (AA) 94920')).toBeTruthy()
      })
    })
  })

  describe('when the addressType is INTERNATIONAL', () => {
    it('displays the second to last line as CITY, STATE, INTERNATIONAL_POSTAL_CODE', () => {
      const mailingAddress: AddressData = {
        id: 1,
        addressLine1: '127 Harvest Moon Dr',
        addressLine2: '',
        addressLine3: '',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Bolton',
        countryCodeIso3: '1',
        internationalPostalCode: 'L7E 2W1',
        province: 'Ontario',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      renderWithData({mailingAddress})
      expect(screen.getByText('Bolton, Ontario, L7E 2W1')).toBeTruthy()
    })

    it('displays the country code on the last line if it exists', () => {
      const mailingAddress: AddressData = {
        id: 1,
        addressLine1: '1707 Tiburon Blvd',
        addressLine2: 'Address line 2',
        addressLine3: 'Address line 3',
        addressPou: 'RESIDENCE/CHOICE',
        addressType: 'INTERNATIONAL',
        city: 'Tiburon',
        countryCodeIso3: 'ESP',
        internationalPostalCode: '1',
        province: 'province',
        stateCode: 'CA',
        zipCode: '94920',
        zipCodeSuffix: '1234',
      }

      renderWithData({mailingAddress})
      expect(screen.getByText('Spain')).toBeTruthy()
    })

    describe('when there is no country code', () => {
      it('displays the message for adding a new mailing address', () => {
        const mailingAddress: AddressData = {
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
        
        renderWithData({mailingAddress})
        expect(screen.getByText('Add your mailing address')).toBeTruthy()
      })
    })

    describe('when only the country code exists', () => {
      it('should only display the country code', () => {
        const mailingAddress: AddressData = {
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
        
        renderWithData({mailingAddress})
        expect(screen.getByText('Spain')).toBeTruthy()
      })
    })
  })

  describe('when the address summary is clicked', () => {
    it('calls onPress', () => {
      fireEvent.press(screen.getByRole('button', { name: 'Mailing address' }))
      expect(mailingAddressOnPressSpy).toBeCalled()
      fireEvent.press(screen.getByRole('button', { name: 'Home address' }))
      expect(residentialAddressOnPressSpy).toBeCalled()
    })
  })
})
