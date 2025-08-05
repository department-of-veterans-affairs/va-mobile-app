import React, { useContext } from 'react'

import { contactInformationKeys } from 'api/contactInformation'
import { AppointmentData, UserContactInformation } from 'api/types'
import { Events } from 'constants/analytics'
import { TravelPayContextProvider } from 'screens/HealthScreen/TravelPay/SubmitTravelPayFlowSteps/components'
import { submitAppointmentClaim } from 'store/api/demo/travelPay'
import { act, render } from 'testUtils'
import { defaultAppointment } from 'utils/tests/appointments'
import { TravelPayContext, TravelPayContextValue } from 'utils/travelPay'

const residentialAddress: UserContactInformation['residentialAddress'] = {
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

const mockAppointment: AppointmentData = {
  ...defaultAppointment,
  attributes: {
    ...defaultAppointment.attributes,
    location: {
      id: '123', // The default appointment has no location id
      ...defaultAppointment.attributes.location,
    },
  },
}

const MOCK_TRAVEL_PAY_CLAIM_RESPONSE = submitAppointmentClaim({
  appointmentDateTime: defaultAppointment.attributes.startDateLocal,
  facilityStationNumber: mockAppointment.attributes.location.id!,
  facilityName: mockAppointment.attributes.location.name,
  appointmentType: 'Other',
  isComplete: false,
})

//#region mocks
const mutateMock = jest.fn()
const mockNavigationSpy = jest.fn()
const mockSubmitClaimSpy = jest.fn()
const mockIsPending = false

jest.mock('utils/hooks', () => {
  const original = jest.requireActual('utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => mockNavigationSpy,
  }
})

let mockLogAnalyticsEvent: jest.Mock
jest.mock('utils/analytics', () => {
  mockLogAnalyticsEvent = jest.fn()
  const original = jest.requireActual('utils/analytics')
  return {
    ...original,
    logAnalyticsEvent: mockLogAnalyticsEvent,
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
//#endregion mocks

describe('TravelPayContextProvider', () => {
  const renderWithProvider = (appointment: AppointmentData = mockAppointment) => {
    let ctx: TravelPayContextValue
    const Wrapper = () => {
      ctx = useContext(TravelPayContext)
      return null
    }

    render(
      <TravelPayContextProvider appointment={appointment} appointmentRouteKey="routeKey">
        <Wrapper />
      </TravelPayContextProvider>,
      {
        navigationProvided: true,
        queriesData: [
          {
            queryKey: contactInformationKeys.contactInformation,
            data: {
              residentialAddress,
            },
          },
        ],
      },
    )

    return () => ctx // function to retrieve latest context value (updated on re-renders)
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('provides initial context values', () => {
    const getCtx = renderWithProvider()
    const ctx = getCtx()

    expect(ctx.appointment).toEqual(mockAppointment)
    expect(ctx.penaltyStatementAccepted).toBe(false)
    expect(ctx.penaltyStatementError).toBe(false)
    expect(ctx.submittingTravelClaim).toBe(false)
    expect(ctx.userContactInformation).toEqual({
      residentialAddress,
    })
  })

  it('updates checkbox state when setIsCheckboxChecked is called', () => {
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().setPenaltyStatementAccepted(true)
    })

    expect(getCtx().penaltyStatementAccepted).toBe(true)
  })

  it('sets checkboxError when submitting without checking the box', () => {
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().submitTravelClaim()
    })

    expect(getCtx().penaltyStatementError).toBe(true)
    expect(mutateMock).not.toHaveBeenCalled()
  })

  it('navigates to MileageScreen when startSmocFlow is called', () => {
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().startSmocFlow()
    })

    expect(mockNavigationSpy).toHaveBeenCalledWith('MileageScreen')
  })

  it('logs total time taken when submitTravelClaim is called', () => {
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().startSmocFlow()
      getCtx().setPenaltyStatementAccepted(true)
    })
    // advance the clock by 1 second
    jest.advanceTimersByTime(1000)

    act(() => {
      getCtx().submitTravelClaim()
    })

    expect(mockLogAnalyticsEvent).toHaveBeenCalledWith(Events.vama_smoc_time_taken(1000))
  })

  it('logs calls submitClaim mutation when submitTravelClaim is called', () => {
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().startSmocFlow()
      getCtx().setPenaltyStatementAccepted(true)
    })

    act(() => {
      getCtx().submitTravelClaim()
    })

    expect(mockSubmitClaimSpy).toHaveBeenCalled()
  })

  it('navigates to SubmitSuccessScreen when submitTravelClaim is successful', () => {
    mockSubmitClaimSpy.mockImplementation((_claimPayload, options) => {
      if (options && options.onSuccess) {
        options.onSuccess(MOCK_TRAVEL_PAY_CLAIM_RESPONSE)
      }
    })
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().startSmocFlow()
      getCtx().setPenaltyStatementAccepted(true)
    })

    act(() => {
      getCtx().submitTravelClaim()
    })

    expect(mockNavigationSpy).toHaveBeenCalledWith('SubmitSuccessScreen', {
      appointmentDateTime: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.appointmentDateTime,
      facilityName: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.facilityName,
      status: MOCK_TRAVEL_PAY_CLAIM_RESPONSE.data.attributes.claimStatus,
    })
  })

  it('navigates to SMOCErrorScreen when submitTravelClaim fails', () => {
    mockSubmitClaimSpy.mockImplementation((_claimPayload, options) => {
      if (options && options.onError) {
        options.onError(new Error('Failed to submit travel claim'), {}, undefined)
      }
    })
    const getCtx = renderWithProvider()

    act(() => {
      getCtx().startSmocFlow()
      getCtx().setPenaltyStatementAccepted(true)
    })

    act(() => {
      getCtx().submitTravelClaim()
    })

    expect(mockNavigationSpy).toHaveBeenCalledWith('SMOCErrorScreen', {
      error: 'error',
    })
  })
})
