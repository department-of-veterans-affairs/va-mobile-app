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

export const TravelPayClaimStatuses = {
  Incomplete: {
    name: 'Incomplete',
    description:
      'You submitted a claim without required expense information. You must provide the required information for BTSSS to process the claim.',
    definition:
      'You haven’t submitted this claim yet. Make sure to add all required information and submit within 30 days of your appointment.',
    reasons: null,
  },
  Saved: {
    name: 'Saved',
    description:
      'You saved changes to your claim, but you did not submit it to BTSSS for review. Submit the claim so BTSSS can begin processing your claim.',
    definition: 'We saved your claim. Make sure to submit it within 30 days of your appointment.',
    reasons: null,
  },
  InProcess: {
    name: 'In process',
    description: 'You submitted a claim, and now BTSSS is reviewing your claim.',
    definition: 'We’re reviewing your claim.',
    reasons: null,
  },
  ClaimSubmitted: {
    name: 'Claim submitted',
    description: 'You submitted a claim for a completed appointment.',
    definition: 'You submitted this claim for review.',
    reasons: null,
  },
  InManualReview: {
    name: 'In manual review',
    description: 'Your claim requires a manual review by a Travel Clerk due to one or more of the following reasons:',
    definition:
      'We’re reviewing your claim. If you have questions, contact your facility’s Beneficiary Travel department.',
    reasons: [
      'Your claim includes receipts',
      'The mileage is not equal to or less than the calculated limit',
      'Your travel does not meet the eligibility requirements. For detailed information about your claim, contact your local VAMC and ask for the Beneficiary Travel department.',
    ],
  },
  OnHold: {
    name: 'On hold',
    description:
      'You must provide the needed information for the claim to be processed. Your Travel Clerk will contact you when they put your claim on hold and tell you what additional information is required. For more information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    definition: 'We need more information to decide your claim. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  Appealed: {
    name: 'Appealed',
    description: 'You appealed the denial of your claim. The Travel Clerk will review your appeal.',
    definition: 'We’re reviewing your claim appeal.',
    reasons: null,
  },
  PartialPayment: {
    name: 'Partial payment',
    description:
      'The Travel Clerk determined the claim does not qualify for a full reimbursement. Instead, they approved a partial payment and a Partial Payment letter was sent to you.',
    definition:
      'Some of the expenses you submitted aren’t eligible for reimbursement. You can review the decision letter for more information.',
    reasons: null,
  },
  Denied: {
    name: 'Denied',
    description: 'The Travel Clerk denied your claim for one or more of the following reasons:',
    definition: 'We denied your claim. You can review the decision letter for more information and how to appeal.',
    reasons: null,
  },
  ClosedWithNoPayment: {
    name: 'Closed with no payment',
    description:
      'The Travel Clerk determined the claim did not incur a cost and that no payment is necessary. The Travel Clerk will archive your claim.',
    definition:
      'We determined you didn’t incur any costs for travel. Since you aren’t eligible for reimbursement, we closed your claim. You can review the decision letter on the Claim Details page for more information and how to appeal.',
    reasons: null,
  },
  ApprovedForPayment: {
    name: 'Approved for payment',
    description: 'The Travel Clerk approved your claim for payment. The payment is pending and has not been paid.',
    definition:
      'We approved your claim. We’ll send payment to the bank account you provided. If you haven’t received it in 10 business days of submission, contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  SubmittedForPayment: {
    name: 'Submitted for payment',
    description:
      'The approved claim payment is assigned to the Financial Service Center (FSC) so that you can receive reimbursement.',
    definition:
      'We approved your claim. We’ll send payment to the bank account you provided. If you haven’t received it in 10 business days of submission, contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  FiscalRescinded: {
    name: 'Fiscal rescinded',
    description:
      'The Financial Service Center (FSC) rejected payment. You will not be able to appeal this decision. For more detailed information about your claim, please contact your local VAMC and ask for the Beneficiary Travel department.',
    definition:
      'We approved your claim. But we can’t process your payment using the bank account you provided. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
  ClaimPaid: {
    name: 'Claim paid',
    description:
      'The reimbursement on the approved claim is paid to the submitter. Note that reimbursements for claims submitted by a Caregiver on behalf of a Veteran claimant are sent to the Caregiver’s address or deposited in the Caregiver’s account.',
    definition: 'We sent payment for this claim to the bank account you provided.',
    reasons: null,
  },
  PaymentCanceled: {
    name: 'Payment canceled',
    description:
      'The fund transfer did not complete because of the claimant’s bank. Payment has been canceled. You may create a new claim and reference the original claim number in the Notes section of the new claim.',
    definition:
      'We approved your claim. But we can’t process your payment using the bank account you provided. Contact your facility’s Beneficiary Travel department.',
    reasons: null,
  },
} as const
