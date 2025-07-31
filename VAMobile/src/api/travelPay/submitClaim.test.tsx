import { CommonActions } from '@react-navigation/native'

import { waitFor } from '@testing-library/react-native'

import { appointmentsKeys } from 'api/appointments'
import { useSubmitTravelClaim } from 'api/travelPay/submitClaim'
import { TimeFrameTypeConstants } from 'constants/appointments'
import { post } from 'store/api'
import { submitAppointmentClaim } from 'store/api/demo/travelPay'
import { context, renderMutation, when } from 'testUtils'
import { defaultAppointment } from 'utils/tests/appointments'
import { appendClaimDataToAppointment } from 'utils/travelPay'

const mockDispatchSpy = jest.fn()

let mockLogNonFatalErrorToFirebase: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogNonFatalErrorToFirebase = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logNonFatalErrorToFirebase: mockLogNonFatalErrorToFirebase,
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useNavigation: () => ({
      dispatch: mockDispatchSpy,
    }),
  }
})

const claimData = {
  appointmentDateTime: defaultAppointment.attributes.startDateUtc,
  facilityStationNumber: '442', // the default appointment location doesn't have an id
  facilityName: defaultAppointment.attributes.location.name,
  appointmentType: 'Other',
  isComplete: false,
}

const MOCK_TRAVEL_PAY_CLAIM_RESPONSE = submitAppointmentClaim(claimData)

context('submitClaim', () => {
  describe('submiting claim', () => {
    it('should strip the appointmentDateTime timezone offset', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/travel-pay/claims', expect.anything())
        .mockResolvedValueOnce(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)

      const { mutate, result } = renderMutation(() => useSubmitTravelClaim('123', 'route_key_42'))

      await mutate(claimData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(post).toBeCalledWith(
        '/v0/travel-pay/claims',
        expect.objectContaining({
          appointmentDateTime: '2021-02-06T19:53:14',
        }),
      )
    })

    it('should update the query data for the correct appointment', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/travel-pay/claims', expect.anything())
        .mockResolvedValueOnce(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)

      const { mutate, result, queryClient } = renderMutation(() =>
        useSubmitTravelClaim(defaultAppointment.id, 'route_key_42'),
      )

      queryClient.setQueryData([appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS], {
        data: [
          {
            ...defaultAppointment,
          },
        ],
      })

      await mutate(claimData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(
        queryClient.getQueryData([appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS]),
      ).toEqual(
        expect.objectContaining({
          data: expect.arrayContaining([
            appendClaimDataToAppointment(defaultAppointment, MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes),
          ]),
        }),
      )
    })

    it('should update the navigation params for the correct appointment', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/travel-pay/claims', expect.anything())
        .mockResolvedValueOnce(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)

      const { mutate, result, queryClient } = renderMutation(() =>
        useSubmitTravelClaim(defaultAppointment.id, 'route_key_42'),
      )

      queryClient.setQueryData([appointmentsKeys.appointments, TimeFrameTypeConstants.PAST_THREE_MONTHS], {
        data: [
          {
            ...defaultAppointment,
          },
        ],
      })

      await mutate(claimData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(true)
      })

      expect(mockDispatchSpy).toHaveBeenCalledWith({
        ...CommonActions.setParams({
          appointment: appendClaimDataToAppointment(defaultAppointment, MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes),
        }),
        source: 'route_key_42',
      })
    })

    it('should log an error to firebase', async () => {
      when(post as jest.Mock)
        .calledWith('/v0/travel-pay/claims', expect.anything())
        .mockRejectedValueOnce({
          status: 400,
          networkError: true,
        })

      const { mutate, result } = renderMutation(() => useSubmitTravelClaim(defaultAppointment.id, 'mock_route_key'))

      await mutate(claimData)

      await waitFor(() => {
        expect(result.current.isSuccess).toBe(false)
      })
      expect(post).toBeCalledWith('/v0/travel-pay/claims', {
        appointmentDateTime: '2021-02-06T19:53:14',
        facilityStationNumber: '442',
        facilityName: 'VA Long Beach Healthcare System',
        appointmentType: 'Other',
        isComplete: false,
      })
      expect(mockLogNonFatalErrorToFirebase).toHaveBeenCalledWith(
        {
          networkError: true,
          status: 400,
        },
        'submitClaim: Service error',
      )
    })
  })
})
