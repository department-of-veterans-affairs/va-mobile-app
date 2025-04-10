import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import { QueriesData, context, fireEvent, mockNavProps, render, screen } from 'testUtils'

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

const params = {
  appointmentDateTime: '2021-01-01T00:00:00Z',
}

const mockNavigationSpy = jest.fn()

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

context('ReviewClaimScreen', () => {
  const props = mockNavProps(undefined, { navigate: mockNavigationSpy }, { params })

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
    expect(screen.getByText(t('travelPay.reviewDetails.what'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.milageOnly'))).toBeTruthy()
    expect(
      screen.getByText(
        DateTime.fromISO(params.appointmentDateTime).toFormat(`cccc, LLLL dd yyyy '${t('dateTime.at')}' hh:mm a ZZZZ`),
      ),
    ).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.how'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.vehicle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.where'))).toBeTruthy()
    expect(screen.getByText(residentialAddress.addressLine1)).toBeTruthy()
    const cityStateZipAddressLine = `${residentialAddress.city}, ${residentialAddress.stateCode}, ${residentialAddress.zipCode}`
    expect(screen.getByText(cityStateZipAddressLine)).toBeTruthy()
    expect(screen.getByText(t('travelPay.travelAgreementHeader'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.penaltyStatement.checkbox'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.penaltyStatement.agreement'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewLink'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.submitClaim'))).toBeTruthy()
  })

  describe('when the user presses the Submit button', () => {
    describe('when the user has not checked the checkbox', () => {
      it('should show an error', () => {
        initializeTestInstance({ residentialAddress })
        const button = screen.getByTestId('submitTestID')
        fireEvent.press(button)
        expect(screen.getByText(t('required'))).toBeTruthy()
      })
    })
    describe('when the user has checked the checkbox', () => {
      it('should navigate to the SubmitLoadingScreen', () => {
        initializeTestInstance({ residentialAddress })
        const checkbox = screen.getByTestId('checkboxTestID')
        fireEvent.press(checkbox)
        const button = screen.getByTestId('submitTestID')
        fireEvent.press(button)
        expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitLoadingScreen')
      })
    })
  })
})
