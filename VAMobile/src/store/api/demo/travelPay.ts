import { DateTime } from 'luxon'

import { SubmitSMOCTravelPayClaimParameters, SubmitTravelPayClaimResponse } from 'api/types'

const MOCK_TRAVEL_PAY_CLAIM_RESPONSE: SubmitTravelPayClaimResponse = {
  data: {
    id: 'mock_id',
    type: 'TravelPayClaimSummary',
    attributes: {
      id: 'mock_id',
      claimNumber: '',
      claimStatus: 'In Progress',
      appointmentDateTime: '2023-02-23T22:22:52.549Z',
      facilityId: '442',
      facilityName: 'Tomah VA Medical Center',
      totalCostRequested: 10.26,
      createdOn: '2023-02-24T22:22:52.549Z',
      modifiedOn: '2023-02-26T22:22:52.549Z',
    },
  },
}

const createMockClaimResponse = (params: SubmitSMOCTravelPayClaimParameters): SubmitTravelPayClaimResponse => {
  const { appointmentDateTime, facilityStationNumber } = params

  const mockClaimResponse = { ...MOCK_TRAVEL_PAY_CLAIM_RESPONSE }
  if (facilityStationNumber === '983GC') {
    mockClaimResponse.data.id = 'mock_id_partial_success'
    mockClaimResponse.data.attributes.id = 'mock_id_partial_success'
    mockClaimResponse.data.attributes.claimStatus = 'Saved'
    mockClaimResponse.data.attributes.facilityId = facilityStationNumber
    mockClaimResponse.data.attributes.facilityName = 'Fort Collins VA Clinic'
    mockClaimResponse.data.attributes.totalCostRequested = undefined
  }
  mockClaimResponse.data.attributes.appointmentDateTime = appointmentDateTime
  mockClaimResponse.data.attributes.facilityId = facilityStationNumber
  const mockDate = DateTime.fromISO(appointmentDateTime).toISO({ includeOffset: false })
  if (mockDate) {
    mockClaimResponse.data.attributes.createdOn = mockDate
    mockClaimResponse.data.attributes.modifiedOn = mockDate
  }
  return mockClaimResponse
}

export type TravelPayDemoReturnTypes = SubmitTravelPayClaimResponse

export const submitAppointmentClaim = (params: SubmitSMOCTravelPayClaimParameters): SubmitTravelPayClaimResponse => {
  return createMockClaimResponse(params)
}
