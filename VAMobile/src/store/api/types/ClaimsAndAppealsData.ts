export const AppealStatusTypesConstants: {
  scheduled_hearing: AppealStatusTypes
  pending_hearing_scheduling: AppealStatusTypes
  on_docket: AppealStatusTypes
  pending_certification_ssoc: AppealStatusTypes
  pending_certification: AppealStatusTypes
  pending_form9: AppealStatusTypes
  pending_soc: AppealStatusTypes
  stayed: AppealStatusTypes
  at_vso: AppealStatusTypes
  bva_development: AppealStatusTypes
  decision_in_progress: AppealStatusTypes
  bva_decision: AppealStatusTypes
  field_grant: AppealStatusTypes
  withdrawn: AppealStatusTypes
  ftr: AppealStatusTypes
  ramp: AppealStatusTypes
  death: AppealStatusTypes
  reconsideration: AppealStatusTypes
  other_close: AppealStatusTypes
  remand_ssoc: AppealStatusTypes
  remand: AppealStatusTypes
  merged: AppealStatusTypes
} = {
  scheduled_hearing: 'scheduled_hearing',
  pending_hearing_scheduling: 'pending_hearing_scheduling',
  on_docket: 'on_docket',
  pending_certification_ssoc: 'pending_certification_ssoc',
  pending_certification: 'pending_certification',
  pending_form9: 'pending_form9',
  pending_soc: 'pending_soc',
  stayed: 'stayed',
  at_vso: 'at_vso',
  bva_development: 'bva_development',
  decision_in_progress: 'decision_in_progress',
  bva_decision: 'bva_decision',
  field_grant: 'field_grant',
  withdrawn: 'withdrawn',
  ftr: 'ftr',
  ramp: 'ramp',
  death: 'death',
  reconsideration: 'reconsideration',
  other_close: 'other_close',
  remand_ssoc: 'remand_ssoc',
  remand: 'remand',
  merged: 'merged',
}

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

export type AppealStatusDetailsIssue = {
  disposition: string
  description: string
}

export type AppealStatusDetailsData = {
  date?: string
  type?: string
  location?: string
  lastSocDate?: string
  vsoName?: string
  issues?: Array<AppealStatusDetailsIssue>
}

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
  lastAction: AppealIssuesLastActions | null
  date: string | null
}

export type AppealEvidenceData = {
  description: string
  data: string
}

export const AppealEventTypesConstants: {
  claim_decision: AppealEventTypes
  nod: AppealEventTypes
  soc: AppealEventTypes
  form9: AppealEventTypes
  ssoc: AppealEventTypes
  certified: AppealEventTypes
  hearing_held: AppealEventTypes
  hearing_no_show: AppealEventTypes
  transcript: AppealEventTypes
  bva_decision: AppealEventTypes
  cavc_decision: AppealEventTypes
  remand_return: AppealEventTypes
  ramp_notice: AppealEventTypes
  field_grant: AppealEventTypes
  withdrawn: AppealEventTypes
  ftr: AppealEventTypes
  ramp: AppealEventTypes
  death: AppealEventTypes
  merged: AppealEventTypes
  reconsideration: AppealEventTypes
  vacated: AppealEventTypes
  other_close: AppealEventTypes
  record_designation: AppealEventTypes
  dro_hearing_held: AppealEventTypes
  dro_hearing_cancelled: AppealEventTypes
  dro_hearing_no_show: AppealEventTypes
  sc_request: AppealEventTypes
  hlr_request: AppealEventTypes
} = {
  claim_decision: 'claim_decision',
  nod: 'nod',
  soc: 'soc',
  form9: 'form9',
  ssoc: 'ssoc',
  certified: 'certified',
  hearing_held: 'hearing_held',
  hearing_no_show: 'hearing_no_show',
  transcript: 'transcript',
  bva_decision: 'bva_decision',
  cavc_decision: 'cavc_decision',
  remand_return: 'remand_return',
  ramp_notice: 'ramp_notice',
  field_grant: 'field_grant',
  withdrawn: 'withdrawn',
  ftr: 'ftr',
  ramp: 'ramp',
  death: 'death',
  merged: 'merged',
  reconsideration: 'reconsideration',
  vacated: 'vacated',
  other_close: 'other_close',
  record_designation: 'record_designation',
  dro_hearing_held: 'dro_hearing_held',
  dro_hearing_cancelled: 'dro_hearing_cancelled',
  dro_hearing_no_show: 'dro_hearing_no_show',
  sc_request: 'sc_request',
  hlr_request: 'hlr_request',
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
  | 'transcript'
  | 'bva_decision'
  | 'cavc_decision'
  | 'remand_return'
  | 'ramp_notice'
  | 'field_grant'
  | 'withdrawn'
  | 'ftr'
  | 'ramp'
  | 'death'
  | 'merged'
  | 'reconsideration'
  | 'vacated'
  | 'other_close'
  | 'record_designation'
  | 'dro_hearing_held'
  | 'dro_hearing_cancelled'
  | 'dro_hearing_no_show'
  | 'sc_request'
  | 'hlr_request'

export type AppealEventData = {
  date: string
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

export const AppealAOJTypesConstants: {
  vba: AppealAOJTypes
  vha: AppealAOJTypes
  nca: AppealAOJTypes
  other: AppealAOJTypes
} = {
  vba: 'vba',
  vha: 'vha',
  nca: 'nca',
  other: 'other',
}

export type AppealAOJTypes = 'vba' | 'vha' | 'nca' | 'other'

export type AppealAlertDetailsData = Record<string, unknown>

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

export const AppealTypesConstants: {
  higherLevelReview: AppealTypes
  supplementalClaim: AppealTypes
  legacyAppeal: AppealTypes
  appeal: AppealTypes
} = {
  higherLevelReview: 'higherLevelReview',
  supplementalClaim: 'supplementalClaim',
  legacyAppeal: 'legacyAppeal',
  appeal: 'appeal',
}

export type AppealTypes = 'higherLevelReview' | 'supplementalClaim' | 'legacyAppeal' | 'appeal'

export type AppealGetData = {
  data: AppealData
}

export type AppealData = {
  type: AppealTypes
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
  dateFiled: string
  minEstDate: string | null
  maxEstDate: string | null
  phaseChangeDate: string | null
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

export type ClaimGetData = {
  data: ClaimData
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

export type ClaimsAndAppealsGetDataMetaErrorDetails = {
  title?: string
  detail?: string
  code?: string
  source?: string
  status?: string
  key?: string
  severity?: string
  text?: string
}

export const ClaimsAndAppealsErrorServiceTypesConstants: {
  APPEALS: ClaimsAndAppealsErrorServiceTypes
  CLAIMS: ClaimsAndAppealsErrorServiceTypes
} = {
  APPEALS: 'appeals',
  CLAIMS: 'claims',
}

export type ClaimsAndAppealsErrorServiceTypes = 'appeals' | 'claims'

export type ClaimsAndAppealsGetDataMetaError = {
  service?: ClaimsAndAppealsErrorServiceTypes
  errorDetails?: Array<ClaimsAndAppealsGetDataMetaErrorDetails>
}

/**
 * currentPage - use to tell us what page we are currently showing when paginating
 * perPage - the page size for each page
 * totalEntries - total number of items
 */
export type ClaimsAndAppealsGetDataMetaPagination = {
  currentPage: number
  perPage: number
  totalEntries: number
}

export type ClaimsAndAppealsGetDataMeta = {
  errors?: Array<ClaimsAndAppealsGetDataMetaError>
  pagination: ClaimsAndAppealsGetDataMetaPagination
  // This property does not exist in api, used to track if the data(ClaimsAndAppealsGetData) return was from an api call
  dataFromStore?: boolean
}

export type ClaimsAndAppealsGetData = {
  data: ClaimsAndAppealsList
  meta: ClaimsAndAppealsGetDataMeta
}

export type ClaimsAndAppealsList = Array<ClaimAndAppealData>

// TODO: need to get data shape for this.
export type ClaimEventDocumentData = {
  uploadDate: string
}

export type ClaimPhaseData = {
  [key: string]: ClaimEventData[]
}
