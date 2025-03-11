import React from 'react'

import { t } from 'i18next'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import { QueriesData, context, mockNavProps, render, screen } from 'testUtils'

import ReviewClaimScreen from './ReviewClaimScreen'

const residentialAddress: AddressData = {
  id: 0,
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

context('ReviewClaimScreen', () => {
  const props = mockNavProps()

  const initializeTestInstance = (contactInformation?: Partial<UserContactInformation>) => {
    let queriesData: QueriesData | undefined

    if (contactInformation) {
      queriesData = [
        {
          queryKey: contactInformationKeys.contactInformation,
          data: {
            ...contactInformation,
          },
        },
      ]
    }
    render(<ReviewClaimScreen {...props} />, { queriesData })
  }

  it('initializes correctly', () => {
    initializeTestInstance({ residentialAddress })
    expect(screen.getByText(t('travelPay.reviewTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewText'))).toBeTruthy()
    expect(screen.getByText(residentialAddress.addressLine1)).toBeTruthy()
    const cityStateZipAddressLine = `${residentialAddress.city}, ${residentialAddress.stateCode}, ${residentialAddress.zipCode}`
    expect(screen.getByText(cityStateZipAddressLine)).toBeTruthy()
  })
})
