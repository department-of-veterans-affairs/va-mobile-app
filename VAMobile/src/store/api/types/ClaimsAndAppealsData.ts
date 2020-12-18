export type AppealStatusTypes =
  | 'scheduled_hearing'
  | 'pending_hearing_scheduling'
  | 'on_docket'
  | 'pending_certification_ssoc'
  | 'pending_certification'
  | 'pending_form9'
  | 'pending_soc'
  | 'stayed'
  | 'at_vso'
  | 'bva_development'
  | 'decision_in_progress'
  | 'bva_decision'
  | 'field_grant'
  | 'withdrawn'
  | 'ftr'
  | 'ramp'
  | 'death'
  | 'reconsideration'
  | 'other_close'
  | 'remand_ssoc'
  | 'remand'
  | 'merged'

export type AppealStatusDetailsData = {}

export type AppealStatusData = {
  details: AppealStatusDetailsData
  type: AppealStatusTypes
}

export type AppealProgramAreaTypes = 'compensation' | 'pension' | 'insurance' | 'loan_guaranty' | 'education' | 'vre' | 'medical' | 'burial' | 'bva' | 'other' | 'multiple'

export type AppealLocationTypes = 'aoj' | 'bva'

export type AppealIssuesLastActions = 'field_grant' | 'withdrawn' | 'allowed' | 'denied' | 'remand' | 'cavc_remand'

export type AppealIssuesData = {
  active: boolean
  description: string
  diagnosticCode: string | null
  lastAction: AppealIssuesLastActions
  date: string
}

export type AppealEvidenceData = {
  description: string
  data: string
}

export type AppealEventTypes =
  | 'claim_decision'
  | 'nod'
  | 'soc'
  | 'form9'
  | 'ssoc'
  | 'certified'
  | 'hearing_held'
  | 'hearing_no_show'
  | 'bva_decision'
  | 'field_grant'
  | 'withdrawn'
  | 'ftr'
  | 'ramp'
  | 'death'
  | 'merged'
  | 'record_designation'
  | 'reconsideration'
  | 'vacated'
  | 'other_close'
  | 'cavc_decision'
  | 'ramp_notice'
  | 'transcript'
  | 'remand_return'
  | 'dro_hearing_held'
  | 'dro_hearing_cancelled'
  | 'dro_hearing_no_show'

export type AppealEventData = {
  data: string
  type: AppealEventTypes
}

export type AppealDocketData = {
  month: string
  docketMonth: string
  front: boolean
  total: number
  ahead: number
  ready: number
  eta: string | null
}

export type AppealAOJTypes = 'vba' | 'vha' | 'nca' | 'other'

export type AppealAlertDetailsData = {}

export type AppealAlertTypes =
  | 'form9_needed'
  | 'scheduled_hearing'
  | 'hearing_no_show'
  | 'held_for_evidence'
  | 'cavc_option'
  | 'ramp_eligible'
  | 'ramp_ineligible'
  | 'decision_soon'
  | 'blocked_by_vso'
  | 'scheduled_dro_hearing'
  | 'dro_hearing_no_show'

export type AppealAlertData = {
  type: AppealAlertTypes
  details: AppealAlertDetailsData
}

export type AppealAttributesData = {
  appealsIds?: Array<string>
  active: boolean
  alerts: Array<AppealAlertData>
  aod: boolean
  aoj: AppealAOJTypes
  description: string
  docket: AppealDocketData
  events: Array<AppealEventData>
  evidence: Array<AppealEvidenceData>
  incompleteHistory: boolean
  issues: Array<AppealIssuesData>
  location: AppealLocationTypes
  programArea: AppealProgramAreaTypes
  status: AppealStatusData
  type: string
  updated: string
}

export type AppealData = {
  type: string
  id: string
  attributes: AppealAttributesData
}

export type ClaimEventData = {
  trackedItemId?: number | null
  description?: string
  displayName?: string
  overdue?: boolean
  status?: string
  fileType?: string
  documentType?: string | null
  filename?: string | null
  uploadDate?: string | null
  type: string
  date: string | null
  uploaded?: boolean
  uploadsAllowed?: boolean
  openedDate?: string | null
  requestedDate?: string | null
  receivedDate?: string | null
  closedDate?: string | null
  suspenseDate?: string | null
  documents?: Array<ClaimEventDocumentData>
  phase?: number
}

export type ClaimAttributesData = {
  evssId: number
  dateFiled: string
  minEstDate: string
  maxEstDate: string
  phaseChangeDate: string
  open: boolean
  waiverSubmitted: boolean
  documentsNeeded: boolean
  developmentLetterSent: boolean
  decisionLetterSent: boolean
  phase: number
  everPhaseBack: boolean
  currentPhaseBack: boolean
  requestedDecision: boolean
  claimType: string
  updatedAt: string
  contentionList: Array<string>
  vaRepresentative: string
  eventsTimeline: Array<ClaimEventData>
}

export type ClaimData = {
  id: string
  type: string
  attributes: ClaimAttributesData
}

export type ClaimAndAppealSubData = {
  subtype: string
  completed: boolean
  dateFiled: string
  updatedAt: string
}

export const ClaimOrAppealConstants: {
  claim: ClaimOrAppeal
  appeal: ClaimOrAppeal
} = {
  claim: 'claim',
  appeal: 'appeal',
}

export type ClaimOrAppeal = 'claim' | 'appeal'

export type ClaimAndAppealData = {
  id: string
  type: ClaimOrAppeal
  attributes: ClaimAndAppealSubData
}

export type ClaimsAndAppealsList = Array<ClaimAndAppealData>

// TODO: need to get data shape for this.
export type ClaimEventDocumentData = {
  uploadDate: string
}

export type ClaimPhaseData = {
  [key: string]: ClaimEventData[]
}
