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
