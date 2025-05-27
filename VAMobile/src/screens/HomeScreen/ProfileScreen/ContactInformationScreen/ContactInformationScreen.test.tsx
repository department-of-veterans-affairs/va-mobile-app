import React from 'react'

import { screen, waitFor } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { AddressData, ContactInformationPayload, EmailData, PhoneData } from 'api/types'
import { get } from 'store/api'
import { QueriesData, context, mockNavProps, render, when } from 'testUtils'

import ContactInformationScreen from './index'

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

const homePhone: PhoneData = {
  areaCode: '555',
  countryCode: '1',
  phoneNumber: '4446666',
  phoneType: 'HOME',
}

const mobilePhone: PhoneData = {
  areaCode: '555',
  countryCode: '1',
  phoneNumber: '4446666',
  phoneType: 'MOBILE',
}

const workPhone: PhoneData = {
  areaCode: '555',
  countryCode: '1',
  phoneNumber: '4446666',
  phoneType: 'WORK',
}

const contactEmail: EmailData = {
  emailAddress: 'attended1@gmail.com',
  id: 'ae19ab8a-7165-57d1-a8e2-200f5031f66c',
}

context('ContactInformationScreen', () => {
  const renderWithData = (queriesData?: QueriesData) => {
    when(get as jest.Mock)
      .calledWith('/v0/user/contact-info')
      .mockResolvedValue({
        data: {
          id: 'ae19ab8a-7165-57d1-a8e2-200f5031f66c',
          type: 'contact-info',
          attributes: {
            residentialAddress,
            mailingAddress,
            homePhone,
            mobilePhone,
            workPhone,
            contactEmail,
          },
        },
      } as ContactInformationPayload)

    const props = mockNavProps(
      {},
      {
        navigate: jest.fn(),
        goBack: jest.fn(),
      },
    )
    render(<ContactInformationScreen {...props} />, { queriesData })
  }

  it('renders correctly', async () => {
    renderWithData()

    expect(screen.getByText(t('contactInformation.loading'))).toBeTruthy()
    await waitFor(() => expect(screen.getByLabelText(t('contactInformation.title'))).toBeTruthy())
  })

  describe('Errors', () => {
    it('displays no auth screen when user not authorized', () => {
      renderWithData([
        {
          queryKey: authorizedServicesKeys.authorizedServices,
          data: {
            appeals: true,
            appointments: true,
            claims: true,
            decisionLetters: true,
            directDepositBenefits: true,
            directDepositBenefitsUpdate: true,
            disabilityRating: true,
            lettersAndDocuments: true,
            militaryServiceHistory: true,
            paymentHistory: true,
            preferredName: true,
            prescriptions: true,
            scheduleAppointments: true,
            secureMessaging: true,
            userProfileUpdate: false, // Important one here
          },
        },
      ])

      expect(screen.findByText(t('noAccessProfileInfo.cantAccess'))).toBeTruthy()
    })
  })
})
