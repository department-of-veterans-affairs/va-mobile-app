export type TravelPayError = 'noAddress' | 'unsupportedType' | 'error'

export type TravelPayPartialSuccessStatus = 'Incomplete' | 'Saved'

export type TravelPayClaimStatus = keyof typeof TravelPayClaimStatuses

/**
 * These statuses are only returned for a travel pay claim that is a partial success.
 */
export const TravelPayPartialSuccessStatusConstants = {
  INCOMPLETE: 'Incomplete',
  SAVED: 'Saved',
} as const

/**
 * Travel Pay claim status definitions with translation keys.
 * All user-facing text is stored in common.json under travelPay.claimStatus.*
 */
export const TravelPayClaimStatuses = {
  Incomplete: {
    name: 'Incomplete',
    descriptionKey: 'travelPay.claimStatus.incomplete.description',
    definitionKey: 'travelPay.claimStatus.incomplete.definition',
    reasonsKey: null,
  },
  Saved: {
    name: 'Saved',
    descriptionKey: 'travelPay.claimStatus.saved.description',
    definitionKey: 'travelPay.claimStatus.saved.definition',
    reasonsKey: null,
  },
  InProcess: {
    name: 'In process',
    descriptionKey: 'travelPay.claimStatus.inProcess.description',
    definitionKey: 'travelPay.claimStatus.inProcess.definition',
    reasonsKey: null,
  },
  ClaimSubmitted: {
    name: 'Claim submitted',
    descriptionKey: 'travelPay.claimStatus.claimSubmitted.description',
    definitionKey: 'travelPay.claimStatus.claimSubmitted.definition',
    reasonsKey: null,
  },
  InManualReview: {
    name: 'In manual review',
    descriptionKey: 'travelPay.claimStatus.inManualReview.description',
    definitionKey: 'travelPay.claimStatus.inManualReview.definition',
    reasonsKey: 'travelPay.claimStatus.inManualReview.reasons',
  },
  OnHold: {
    name: 'On hold',
    descriptionKey: 'travelPay.claimStatus.onHold.description',
    definitionKey: 'travelPay.claimStatus.onHold.definition',
    reasonsKey: null,
  },
  Appealed: {
    name: 'Appealed',
    descriptionKey: 'travelPay.claimStatus.appealed.description',
    definitionKey: 'travelPay.claimStatus.appealed.definition',
    reasonsKey: null,
  },
  PartialPayment: {
    name: 'Partial payment',
    descriptionKey: 'travelPay.claimStatus.partialPayment.description',
    definitionKey: 'travelPay.claimStatus.partialPayment.definition',
    reasonsKey: null,
  },
  Denied: {
    name: 'Denied',
    descriptionKey: 'travelPay.claimStatus.denied.description',
    definitionKey: 'travelPay.claimStatus.denied.definition',
    reasonsKey: null,
  },
  ClosedWithNoPayment: {
    name: 'Closed with no payment',
    descriptionKey: 'travelPay.claimStatus.closedWithNoPayment.description',
    definitionKey: 'travelPay.claimStatus.closedWithNoPayment.definition',
    reasonsKey: null,
  },
  ApprovedForPayment: {
    name: 'Approved for payment',
    descriptionKey: 'travelPay.claimStatus.approvedForPayment.description',
    definitionKey: 'travelPay.claimStatus.approvedForPayment.definition',
    reasonsKey: null,
  },
  SubmittedForPayment: {
    name: 'Submitted for payment',
    descriptionKey: 'travelPay.claimStatus.submittedForPayment.description',
    definitionKey: 'travelPay.claimStatus.submittedForPayment.definition',
    reasonsKey: null,
  },
  FiscalRescinded: {
    name: 'Fiscal rescinded',
    descriptionKey: 'travelPay.claimStatus.fiscalRescinded.description',
    definitionKey: 'travelPay.claimStatus.fiscalRescinded.definition',
    reasonsKey: null,
  },
  ClaimPaid: {
    name: 'Claim paid',
    descriptionKey: 'travelPay.claimStatus.claimPaid.description',
    definitionKey: 'travelPay.claimStatus.claimPaid.definition',
    reasonsKey: null,
  },
  PaymentCanceled: {
    name: 'Payment canceled',
    descriptionKey: 'travelPay.claimStatus.paymentCanceled.description',
    definitionKey: 'travelPay.claimStatus.paymentCanceled.definition',
    reasonsKey: null,
  },
} as const
