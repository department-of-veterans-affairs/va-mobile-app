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
