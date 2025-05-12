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
  appointmentType: string
  isComplete: boolean
}

export type SubmitTravelPayClaimResponseData = {
  data: TravelPayClaimSummary
}
