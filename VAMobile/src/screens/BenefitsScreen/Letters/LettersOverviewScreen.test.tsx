import React from 'react'

import { fireEvent, screen } from '@testing-library/react-native'
import { t } from 'i18next'

import { authorizedServicesKeys } from 'api/authorizedServices/queryKeys'
import { profileAddressOptions } from 'screens/HomeScreen/ProfileScreen/ContactInformationScreen/AddressSummary'
import { context, mockNavProps, render } from 'testUtils'

import { LettersOverviewScreen } from './index'

const mockNavigationSpy = jest.fn()
jest.mock('utils/hooks', () => {
  const actual = jest.requireActual('utils/hooks')
  return {
    ...actual,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('LettersOverviewScreen', () => {
  const initializeTestInstance = (isAuthorized = true) => {
    render(<LettersOverviewScreen {...mockNavProps()} />, {
      queriesData: [
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
            lettersAndDocuments: isAuthorized,
            militaryServiceHistory: true,
            paymentHistory: true,
            preferredName: true,
            prescriptions: true,
            scheduleAppointments: true,
            secureMessaging: true,
            userProfileUpdate: true,
          },
        },
      ],
    })
  }

  beforeEach(() => {
    initializeTestInstance()
  })

  it('initializes correctly', () => {
    expect(screen.getByText(t('letters.overview.documents'))).toBeTruthy()
    expect(
      screen.getByRole('link', {
        name: `${t('contactInformation.mailingAddress')} ${t('contactInformation.addYour', { field: 'mailing address' })}`,
      }),
    ).toBeTruthy()
    expect(screen.getByText(t('letters.overview.ifThisAddress'))).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Review letters' })).toBeTruthy()
  })

  it('should go to edit address when the address is pressed', () => {
    fireEvent.press(
      screen.getByRole('link', {
        name: `${t('contactInformation.mailingAddress')} ${t('contactInformation.addYour', { field: 'mailing address' })}`,
      }),
    )
    expect(mockNavigationSpy).toHaveBeenCalledWith('EditAddress', {
      displayTitle: t('contactInformation.mailingAddress'),
      addressType: profileAddressOptions.MAILING_ADDRESS,
    })
  })

  it('should go to letters list screen when Review letters is pressed', () => {
    fireEvent.press(screen.getByRole('button', { name: t('letters.overview.viewLetters') }))
    expect(mockNavigationSpy).toHaveBeenCalledWith('LettersList')
  })

  it('should show No Letters screen when service is not authorized', () => {
    initializeTestInstance(false)
    expect(screen.getByRole('header', { name: t('noLetters.header') })).toBeTruthy()
  })
})
