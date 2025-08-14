import React from 'react'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import { TravelPayContextProvider } from 'components/TravelPayContext'
import ReviewClaimScreen from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/ReviewClaimScreen'
import { QueriesData, context, fireEvent, mockNavProps, render, screen } from 'testUtils'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'

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

const appointment = {
  ...defaultAppointment,
  attributes: {
    ...defaultAppointmentAttributes,
    startDateUtc: '2021-02-06T19:53:14.000+00:00',
    startDateLocal: '2021-02-06T18:53:14.000-01:00',
    location: {
      id: '442',
      name: 'Tomah VA Medical Center',
    },
  },
}

const mockNavigationSpy = jest.fn()
const mockSubmitClaimSpy = jest.fn()
const mockDispatchSpy = jest.fn()
let mockIsPending = false

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

jest.mock('api/travelPay/submitClaim', () => {
  return {
    useSubmitTravelClaim: () => ({
      mutate: mockSubmitClaimSpy,
      isPending: mockIsPending,
    }),
  }
})

jest.mock('components/Templates/MultiStepSubtask', () => {
  const original = jest.requireActual('components/Templates/MultiStepSubtask')
  const ReactActual = jest.requireActual('react')
  return {
    ...original,
    useSubtaskProps: jest.fn(),
    SubtaskContext: ReactActual.createContext({ setSubtaskProps: jest.fn() }),
  }
})

context('ReviewClaimScreen', () => {
  const props = mockNavProps(undefined, { dispatch: mockDispatchSpy })

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
    render(
      <TravelPayContextProvider appointment={appointment} appointmentRouteKey="key">
        <ReviewClaimScreen {...props} />
      </TravelPayContextProvider>,
      { queriesData },
    )
  }

  afterEach(() => {
    mockIsPending = false
  })

  it('initializes correctly', () => {
    initializeTestInstance({ residentialAddress })
    expect(screen.getByText(t('travelPay.reviewTitle'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.what'))).toBeTruthy()
    expect(screen.getByText(t('travelPay.reviewDetails.milageOnly'))).toBeTruthy()
    expect(
      screen.getByText(
        DateTime.fromISO(appointment.attributes.startDateLocal).toFormat(
          `cccc, LLLL dd yyyy '${t('dateTime.at')}' hh:mm a ZZZZ`,
        ),
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
        expect(screen.getByText(t('Error: (Required)'))).toBeTruthy()
      })
    })

    describe('when the user has checked the checkbox', () => {
      it('should call the submitTravelClaim function', async () => {
        initializeTestInstance({ residentialAddress })
        const checkbox = screen.getByTestId('checkboxTestID')
        fireEvent.press(checkbox)
        const button = screen.getByTestId('submitTestID')
        fireEvent.press(button)

        expect(mockSubmitClaimSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when the submission is pending', () => {
    it('should show the loading screen', async () => {
      mockIsPending = true
      initializeTestInstance({ residentialAddress })
      expect(screen.getByText(t('travelPay.submitLoading'))).toBeTruthy()
      expect(screen.queryByTestId('reviewClaimScreenID')).toBeNull()
    })
  })
})
