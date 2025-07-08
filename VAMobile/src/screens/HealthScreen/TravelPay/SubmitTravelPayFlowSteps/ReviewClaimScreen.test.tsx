import React from 'react'

import { CommonActions } from '@react-navigation/native'

import { t } from 'i18next'
import { DateTime } from 'luxon'

import { contactInformationKeys } from 'api/contactInformation'
import { AddressData, UserContactInformation } from 'api/types'
import ReviewClaimScreen from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/ReviewClaimScreen'
import { submitAppointmentClaim } from 'store/api/demo/travelPay'
import { QueriesData, context, fireEvent, mockNavProps, render, screen, waitFor } from 'testUtils'
import { defaultAppointment, defaultAppointmentAttributes } from 'utils/tests/appointments'
import { appendClaimDataToAppointment } from 'utils/travelPay'

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
  appointment: {
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
  },
  appointmentRouteKey: 'key',
}

const MOCK_TRAVEL_PAY_CLAIM_RESPONSE = submitAppointmentClaim({
  appointmentDateTime: params.appointment.attributes.startDateLocal,
  facilityStationNumber: params.appointment.attributes.location.id,
  facilityName: params.appointment.attributes.location.name,
  appointmentType: 'Other',
  isComplete: false,
})

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
  const props = mockNavProps(undefined, { dispatch: mockDispatchSpy }, { params })

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
        DateTime.fromISO(params.appointment.attributes.startDateLocal).toFormat(
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
        expect(screen.getByText(t('required'))).toBeTruthy()
      })
    })

    describe('when the user has checked the checkbox', () => {
      it('should submit the claim', async () => {
        initializeTestInstance({ residentialAddress })
        const checkbox = screen.getByTestId('checkboxTestID')
        fireEvent.press(checkbox)
        const button = screen.getByTestId('submitTestID')
        fireEvent.press(button)

        expect(mockSubmitClaimSpy).toHaveBeenCalledWith(
          {
            appointmentDateTime: params.appointment.attributes.startDateLocal,
            facilityStationNumber: params.appointment.attributes.location.id,
            appointmentType: 'Other',
            facilityName: params.appointment.attributes.location.name,
            isComplete: false,
          },
          expect.any(Object),
        )
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

  describe('when the submission is successful', () => {
    it('should navigate to the SubmitSuccessScreen', async () => {
      mockSubmitClaimSpy.mockImplementation((_claimPayload, options) => {
        if (options && options.onSuccess) {
          options.onSuccess(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)
        }
      })
      initializeTestInstance({ residentialAddress })
      const checkbox = screen.getByTestId('checkboxTestID')
      fireEvent.press(checkbox)
      const button = screen.getByTestId('submitTestID')
      fireEvent.press(button)

      await waitFor(() => {
        expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitSuccessScreen', {
          appointmentDateTime: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.appointmentDateTime,
          facilityName: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.facilityName,
          status: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.claimStatus,
        })
      })
    })

    it('should update the navigation params', async () => {
      mockSubmitClaimSpy.mockImplementation((_claimPayload, options) => {
        if (options && options.onSuccess) {
          options.onSuccess(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)
        }
      })
      initializeTestInstance({ residentialAddress })
      const checkbox = screen.getByTestId('checkboxTestID')
      fireEvent.press(checkbox)
      const button = screen.getByTestId('submitTestID')
      fireEvent.press(button)

      await waitFor(() => {
        expect(mockDispatchSpy).toHaveBeenCalledWith({
          ...CommonActions.setParams({
            appointment: appendClaimDataToAppointment(
              params.appointment,
              MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes,
            ),
          }),
          source: params.appointmentRouteKey,
        })
        expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitSuccessScreen', {
          appointmentDateTime: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.appointmentDateTime,
          facilityName: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.facilityName,
          status: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.claimStatus,
        })
      })
    })
  })

  describe('when the submission fails', () => {
    it('should navigate to the SMOCErrorScreen', async () => {
      mockSubmitClaimSpy.mockImplementation((_claimPayload, options) => {
        if (options && options.onError) {
          options.onError(new Error('Failed to submit travel claim'), {}, undefined)
        }
      })
      initializeTestInstance({ residentialAddress })
      const checkbox = screen.getByTestId('checkboxTestID')
      fireEvent.press(checkbox)
      const button = screen.getByTestId('submitTestID')
      fireEvent.press(button)

      await waitFor(() => {
        expect(mockNavigationSpy).toHaveBeenCalledWith('SMOCErrorScreen', {
          error: 'error',
        })
      })
    })
  })
})
