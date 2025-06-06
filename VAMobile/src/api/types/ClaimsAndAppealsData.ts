import { Asset } from 'react-native-image-picker'

import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

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
  ama_remand: AppealStatusTypes
  statutory_opt_in: AppealStatusTypes
  evidentiary_period: AppealStatusTypes
  post_bva_dta_decision: AppealStatusTypes
  bva_decision_effectuation: AppealStatusTypes
  sc_received: AppealStatusTypes
  hlr_received: AppealStatusTypes
  hlr_decision: AppealStatusTypes
  hlr_dta_error: AppealStatusTypes
  sc_decision: AppealStatusTypes
  sc_closed: AppealStatusTypes
  hlr_closed: AppealStatusTypes
  remand_return: AppealStatusTypes
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
  ama_remand: 'ama_remand',
  statutory_opt_in: 'statutory_opt_in',
  evidentiary_period: 'evidentiary_period',
  post_bva_dta_decision: 'post_bva_dta_decision',
  bva_decision_effectuation: 'bva_decision_effectuation',
  sc_received: 'sc_received',
  hlr_received: 'hlr_received',
  hlr_decision: 'hlr_decision',
  hlr_dta_error: 'hlr_dta_error',
  sc_decision: 'sc_decision',
  sc_closed: 'sc_closed',
  hlr_closed: 'hlr_closed',
  remand_return: 'remand_return',
}

type AppealStatusTypes =
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
  | 'ama_remand'
  | 'statutory_opt_in'
  | 'evidentiary_period'
  | 'post_bva_dta_decision'
  | 'bva_decision_effectuation'
  | 'sc_received'
  | 'hlr_received'
  | 'hlr_decision'
  | 'hlr_dta_error'
  | 'sc_decision'
  | 'sc_closed'
  | 'hlr_closed'
  | 'remand_return'

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
  informalConference?: string
  bvaDecisionDate?: string
  aojDecisionDate?: string
}

export type AppealStatusData = {
  details: AppealStatusDetailsData
  type: AppealStatusTypes
}

export const AppealProgramAreaTypesConstants: {
  compensation: AppealProgramAreaTypes
  pension: AppealProgramAreaTypes
  insurance: AppealProgramAreaTypes
  loan_guaranty: AppealProgramAreaTypes
  education: AppealProgramAreaTypes
  vre: AppealProgramAreaTypes
  medical: AppealProgramAreaTypes
  burial: AppealProgramAreaTypes
  bva: AppealProgramAreaTypes
  other: AppealProgramAreaTypes
  multiple: AppealProgramAreaTypes
} = {
  compensation: 'compensation',
  pension: 'pension',
  insurance: 'insurance',
  loan_guaranty: 'loan_guaranty',
  education: 'education',
  vre: 'vre',
  medical: 'medical',
  burial: 'burial',
  bva: 'bva',
  other: 'other',
  multiple: 'multiple',
}

type AppealProgramAreaTypes =
  | 'compensation'
  | 'pension'
  | 'insurance'
  | 'loan_guaranty'
  | 'education'
  | 'vre'
  | 'medical'
  | 'burial'
  | 'bva'
  | 'other'
  | 'multiple'

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
  ama_nod: AppealEventTypes
  docket_change: AppealEventTypes
  distributed_to_vlj: AppealEventTypes
  bva_decision_effectuation: AppealEventTypes
  dta_decision: AppealEventTypes
  sc_other_close: AppealEventTypes
  hlr_decision: AppealEventTypes
  hlr_dta_error: AppealEventTypes
  hlr_other_close: AppealEventTypes
  statutory_opt_in: AppealEventTypes
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
  ama_nod: 'ama_nod',
  docket_change: 'docket_change',
  distributed_to_vlj: 'distributed_to_vlj',
  bva_decision_effectuation: 'bva_decision_effectuation',
  dta_decision: 'dta_decision',
  sc_other_close: 'sc_other_close',
  hlr_decision: 'hlr_decision',
  hlr_dta_error: 'hlr_dta_error',
  hlr_other_close: 'hlr_other_close',
  statutory_opt_in: 'statutory_opt_in',
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
  | 'ama_nod'
  | 'docket_change'
  | 'distributed_to_vlj'
  | 'bva_decision_effectuation'
  | 'dta_decision'
  | 'sc_other_close'
  | 'hlr_decision'
  | 'hlr_dta_error'
  | 'hlr_other_close'
  | 'statutory_opt_in'

export type AppealEventData = {
  date: string
  type: AppealEventTypes
}

type AppealDocketData = {
  month: string
  docketMonth: string
  front: boolean
  total: number
  ahead: number
  ready: number
  eta: string | null
  type?: string
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

type AppealAlertTypes =
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

export type AppealIssueLastActionTypes =
  | 'field_grant'
  | 'withdrawn'
  | 'allowed'
  | 'denied'
  | 'remand'
  | 'cavc_remand'
  | null

export const AppealIssueLastAction: {
  fieldGrant: AppealIssueLastActionTypes
  withdrawn: AppealIssueLastActionTypes
  allowed: AppealIssueLastActionTypes
  denied: AppealIssueLastActionTypes
  remand: AppealIssueLastActionTypes
  cavcRemand: AppealIssueLastActionTypes
} = {
  fieldGrant: 'field_grant',
  withdrawn: 'withdrawn',
  allowed: 'allowed',
  denied: 'denied',
  remand: 'remand',
  cavcRemand: 'cavc_remand',
}

export type AppealIssue = {
  active: boolean
  description: string
  diagnosticCode: string | null
  lastAction: AppealIssueLastActionTypes
  date: string | null
}

export type AppealAttributesData = {
  appealsIds?: Array<string>
  active: boolean
  alerts: Array<{
    type: AppealAlertTypes
    details: Record<string, unknown>
  }>
  aod: boolean
  aoj: AppealAOJTypes
  description: string
  docket: AppealDocketData
  events: Array<AppealEventData>
  evidence: Array<{
    description: string
    data: string
  }>
  incompleteHistory: boolean
  issues: Array<AppealIssue>
  location: 'aoj' | 'bva'
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

export type ClaimOrAppeal = 'claim' | 'appeal'

export type ClaimsAndAppealsListPayload = {
  data: Array<ClaimsAndAppealsList>
  meta: {
    errors?: Array<ClaimsAndAppealsGetDataMetaError>
    pagination: {
      currentPage: number
      perPage: number
      totalEntries: number
    }
    activeClaimsCount?: number
  }
}

export type ClaimsAndAppealsGetDataMetaError = {
  service?: string
  errorDetails?: Array<{
    title?: string
    detail?: string
    code?: string
    source?: string
    status?: string
    key?: string
    severity?: string
    text?: string
  }>
}

export type ClaimsAndAppealsList = {
  id: string
  type: ClaimOrAppeal
  attributes: {
    subtype: string
    completed: boolean
    dateFiled: string
    updatedAt: string
    displayTitle: string
    decisionLetterSent: boolean
    phase?: number | string
    claimTypeCode?: string
    documentsNeeded?: boolean
    developmentLetterSent?: boolean
  }
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
  documentId?: string
}

export type ClaimEFolderData = {
  data: Array<ClaimEFolderDocuments>
}

export type ClaimEFolderDocuments = {
  id: string
  type: string
  attributes: {
    doc_type: string
    type_description: string
    received_at: string
  }
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
  claimTypeCode: string
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

export const ClaimOrAppealConstants: {
  claim: ClaimOrAppeal
  appeal: ClaimOrAppeal
} = {
  claim: 'claim',
  appeal: 'appeal',
}

export const ClaimsAndAppealsErrorServiceTypesConstants: {
  APPEALS: ClaimsAndAppealsErrorServiceTypes
  CLAIMS: ClaimsAndAppealsErrorServiceTypes
} = {
  APPEALS: 'appeals',
  CLAIMS: 'claims',
}

type ClaimsAndAppealsErrorServiceTypes = 'appeals' | 'claims'

export type ClaimsAndAppealsGetDataMeta = {
  errors?: Array<ClaimsAndAppealsGetDataMetaError>
  pagination: {
    currentPage: number
    perPage: number
    totalEntries: number
  }
  activeClaimcCount: number
  // This property does not exist in api, used to track if the data(ClaimsAndAppealsGetData) return was from an api call
  dataFromStore: boolean
}

export type ClaimsAndAppealsGetData = {
  data: ClaimsAndAppealsList
  meta: ClaimsAndAppealsGetDataMeta
}

// TODO: need to get data shape for this.
export type ClaimEventDocumentData = {
  trackedItemId?: number
  fileType?: string
  documentType?: string
  filename?: string
  uploadDate: string
  documentId?: string
}

export type ClaimPhaseData = {
  [key: string]: ClaimEventData[]
}

export type ClaimDocUploadData = {
  data: { jobId: string }
}

export type ClaimDecisionResponseData = {
  data: { jobId: string }
}

type FileRequestTypes =
  | 'still_need_from_you_list'
  | 'received_from_you_list'
  | 'still_need_from_others_list'
  | 'received_from_others_list'
  | 'never_received_from_you_list'
  | 'never_received_from_others_list'
  | 'other_documents_list'

export const FILE_REQUEST_TYPE: {
  STILL_NEED_FROM_YOU: FileRequestTypes
  RECEIVED_FROM_YOU: FileRequestTypes
  NEVER_RECEIVED_FROM_YOU: FileRequestTypes
  STILL_NEED_FROM_OTHERS: FileRequestTypes
  RECEIVED_FROM_OTHERS: FileRequestTypes
  NEVER_RECEIVED_FROM_OTHERS: FileRequestTypes
  OTHER_DOCUMENTS_LISTS: FileRequestTypes
} = {
  STILL_NEED_FROM_YOU: 'still_need_from_you_list',
  RECEIVED_FROM_YOU: 'received_from_you_list',
  NEVER_RECEIVED_FROM_YOU: 'never_received_from_you_list',
  STILL_NEED_FROM_OTHERS: 'still_need_from_others_list',
  RECEIVED_FROM_OTHERS: 'received_from_others_list',
  NEVER_RECEIVED_FROM_OTHERS: 'never_received_from_others_list',
  OTHER_DOCUMENTS_LISTS: 'other_documents_list',
}

type FileRequestsStatuses = 'NEEDED' | 'SUBMITTED_AWAITING_REVIEW'

export const FILE_REQUEST_STATUS: {
  NEEDED: FileRequestsStatuses
  SUBMITTED_AWAITING_REVIEW: FileRequestsStatuses
} = {
  NEEDED: 'NEEDED',
  SUBMITTED_AWAITING_REVIEW: 'SUBMITTED_AWAITING_REVIEW',
}

export type UploadFileToClaimParamaters = {
  claimID: string
  documentType: string
  request: ClaimEventData | undefined
  files: Array<Asset> | Array<DocumentPickerResponse>
}
