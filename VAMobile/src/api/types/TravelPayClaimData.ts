export type TravelPayClaimSummary = {
  id: string
  claimNumber?: string
  claimStatus: string
  appointmentDateTime: string
  facilityId?: string
  facilityName: string
  totalCostRequested?: number
  reimbursementAmount?: number
  createdOn: string
  modifiedOn: string
}

export type TravelPayClaimData = {
  id: string
  type: string
  attributes: TravelPayClaimSummary
}

export type SubmitSMOCTravelPayClaimParameters = {
  appointmentDateTime: string
  facilityStationNumber: string
  facilityName: string
  appointmentType: string
  isComplete: boolean
}

export type SubmitTravelPayClaimResponse = {
  data: {
    id: string
    type: string
    attributes: TravelPayClaimSummary
  }
}

export type GetTravelPayClaimsParams = {
  startDate: string
  endDate: string
  page?: number
}

export type GetTravelPayClaimsResponse = {
  metadata: {
    totalRecordCount: number
    pageNumber: number
    status: number // will be either 200 if all claims returned, 206 if only some claims returned
  }
  data: Array<TravelPayClaimData>
}
