export type VeteranStatus = 'confirmed' | 'not confirmed'
export type NotConfirmedReason = 'ERROR' | 'MORE_RESEARCH_REQUIRED' | 'NOT_TITLE_38' | 'PERSON_NOT_FOUND'
export type ConfirmationStatus =
  | 'DISCHONORABLE_SSC'
  | 'INELIGIBLE_SSC'
  | 'UNKNOWN_SSC'
  | 'EDIPI_NO_PNL_SSC'
  | 'CURRENTLY_SERVING_SSC'
  | 'ERROR_SSC'
  | 'UNCAUGHT_SSC'
  | 'UNKNOWN_REASON'
  | 'NO_SSC_CHECK'
  | 'AD_DSCH_VAL_SSC'
  | 'AD_VAL_PREV_QUAL_SSC'
  | 'AD_VAL_PREV_RES_GRD_SSC'
  | 'AD_UNCHAR_DSCH_SSC'
  | 'VAL_PREV_QUAL_SSC'

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
