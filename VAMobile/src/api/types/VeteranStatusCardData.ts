export type VeteranStatus = 'confirmed' | 'not confirmed'
export type NotConfirmedReason = 'ERROR' | 'MORE_RESEARCH_REQUIRED' | 'NOT_TITLE_38' | 'PERSON_NOT_FOUND'
export type ServiceHistoryStatus = 'found' | 'empty' | string // string captures '403', '500', etc.

export type VeteranStatusInfo = {
  veteranStatus: VeteranStatus
  notConfirmedReason?: NotConfirmedReason
  serviceHistoryStatus: ServiceHistoryStatus
  serviceSummaryCode?: string
}

export type VeteranStatusCardData = {
  type: 'veteran_status_card'
  attributes: {
    fullName: string
    latestService?: {
      beginDate: string
      endDate: string
      branch: string
    }
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
