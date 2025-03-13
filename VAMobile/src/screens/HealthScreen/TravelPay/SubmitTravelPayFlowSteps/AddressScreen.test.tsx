import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { QueriesData, context, mockNavProps, render } from 'testUtils'

import AddressScreen from './AddressScreen'

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

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

context('AddressScreen', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })
  const props = mockNavProps(undefined, { navigate: mockNavigationSpy })

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
    render(<AddressScreen {...props} />, { queriesData })
  }

  it('navigates to EditAddress screen when residential address is pressed', () => {
    initializeTestInstance()
    const testID =
      t('contactInformation.residentialAddress') +
      ' ' +
      t('contactInformation.addYour', { field: t(`contactInformation.residentialAddress`).toLowerCase() })
    const button = screen.getByTestId(testID)
    fireEvent.press(button)
    expect(mockNavigationSpy).toHaveBeenCalledWith('EditAddress', {
      displayTitle: t('contactInformation.residentialAddress'),
      addressType: profileAddressOptions.RESIDENTIAL_ADDRESS,
    })
  })

  it('initializes correctly', () => {
    initializeTestInstance()
    expect(screen.getByText(t('travelPay.addressQuestion'))).toBeTruthy()
  })

  describe('when there is address data', () => {
    it('renders the residential address', () => {
      initializeTestInstance({ residentialAddress })
      expect(screen.getByText(t('travelPay.addressQualifier'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.referToPortal'))).toBeTruthy()
      expect(screen.getByText(t('travelPay.addressPOBox'))).toBeTruthy()
    })
  })

  describe('when there is no address data', () => {
    it('renders the no address text', () => {
      initializeTestInstance()
      expect(screen.getByText(t('travelPay.noAddressText'))).toBeTruthy()
    })
  })
})
