export type VeteranStatus = 'confirmed' | 'not confirmed'
export type NotConfirmedReason = 'ERROR' | 'MORE_RESEARCH_REQUIRED' | 'NOT_TITLE_38' | 'PERSON_NOT_FOUND'
export type ConfirmationStatus =
  // Missing identifiers
  | 'INELIGIBLE_NO_ICN'
  | 'INELIGIBLE_NO_EDIPI'

  // No SSC check
  | 'ELIGIBLE_NO_SSC_CHECK'
  | 'INELIGIBLE_NO_SSC_CHECK'

  // Eligible SSC outcomes
  | 'ELIGIBLE_AD_DSCH_VAL_SSC'
  | 'ELIGIBLE_AD_VAL_PREV_QUAL_SSC'
  | 'ELIGIBLE_AD_VAL_PREV_RES_GRD_SSC'
  | 'ELIGIBLE_AD_UNCHAR_DSCH_SSC'
  | 'ELIGIBLE_VAL_PREV_QUAL_SSC'

  // Ineligible SSC outcomes
  | 'INELIGIBLE_DISHONORABLE_SSC'
  | 'INELIGIBLE_SERVICE_SSC'
  | 'INELIGIBLE_UNKNOWN_SSC'
  | 'INELIGIBLE_EDIPI_NO_PNL_SSC'
  | 'INELIGIBLE_CURRENTLY_SERVING_SSC'
  | 'INELIGIBLE_ERROR_SSC'
  | 'INELIGIBLE_UNCAUGHT_SSC'

export type VeteranStatusInfo = {
  veteranStatus: VeteranStatus
  notConfirmedReason?: NotConfirmedReason
  confirmation_status?: ConfirmationStatus
  serviceSummaryCode?: string
}

export type VeteranStatusCardData = {
  type: 'veteran_status_card'
  attributes: {
    fullName: string
    edipi: string
    disabilityRating: number | null
  } & VeteranStatusInfo
}

export type VeteranStatusCardAlert = {
  type: 'veteran_status_alert'
  attributes: {
    alertType: 'error' | 'warning'
    header: string
    body: Array<
      | { type: 'text'; value: string }
      | { type: 'phone'; value: string; tty?: boolean }
      | { type: 'link'; value: string; url: string }
    >
  } & VeteranStatusInfo
}

export type VeteranStatusCardResponse = VeteranStatusCardData | VeteranStatusCardAlert
