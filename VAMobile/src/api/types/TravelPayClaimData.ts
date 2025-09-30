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

export type TravelPayClaimsDateRange = {
  startDate: string
  endDate: string
}

export type GetTravelPayClaimsParams = TravelPayClaimsDateRange & {
  pageNumber?: number
}

export type GetTravelPayClaimsResponse = {
  meta: {
    totalRecordCount: number
    pageNumber: number
    status: number // will be either 200 if all claims returned, 206 if only some claims returned
  }
  data: Array<TravelPayClaimData>
}

export type TravelPayClaimRejectionReason = {
  rejectionReasonId: string
  rejectionReasonName: string
  rejectionReasonTitle: string
  rejectionReasonDescription: string
}

export type TravelPayClaimAppointment = {
  id: string
  appointmentSource: string
  appointmentDateTime: string
  appointmentName: string
  appointmentType: string
  facilityId: string
  facilityName: string
  serviceConnectedDisability: number
  currentStatus: string
  appointmentStatus: string
  externalAppointmentId: string
  associatedClaimId: string
  associatedClaimNumber: string
  isCompleted: boolean
}

export type TravelPayClaimExpense = {
  id: string
  expenseType: string
  name: string
  dateIncurred: string
  description: string
  costRequested: number
  costSubmitted: number
}

export type TravelPayClaimDocument = {
  documentId: string
  filename: string
  mimetype: string
  createdon: string
}

export type TravelPayClaimDetails = {
  id: string
  claimNumber: string
  claimName: string
  claimantFirstName: string
  claimantMiddleName: string
  claimantLastName: string
  claimStatus: string
  appointmentDate: string
  facilityName: string
  totalCostRequested: number
  reimbursementAmount: number
  rejectionReason?: TravelPayClaimRejectionReason
  appointment: TravelPayClaimAppointment
  expenses: TravelPayClaimExpense[]
  documents: TravelPayClaimDocument[]
  createdOn: string
  modifiedOn: string
}

export type TravelPayClaimDetailData = {
  id: string
  type: string
  attributes: TravelPayClaimDetails
}

export type GetTravelPayClaimDetailsResponse = {
  data: TravelPayClaimDetailData
}
