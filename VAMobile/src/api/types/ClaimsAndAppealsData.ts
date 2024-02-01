import { Asset } from 'react-native-image-picker'
import { DocumentPickerResponse } from 'screens/BenefitsScreen/BenefitsStackScreens'

export type UploadFileToClaimParamaters = {
  claimID: string
  request: ClaimEventData
  files: Array<Asset> | Array<DocumentPickerResponse>
}

export type ClaimOrAppeal = 'claim' | 'appeal'

export const ClaimOrAppealConstants: {
  claim: ClaimOrAppeal
  appeal: ClaimOrAppeal
} = {
  claim: 'claim',
  appeal: 'appeal',
}

export const ClaimTypeConstants: {
  ACTIVE: ClaimType
  CLOSED: ClaimType
} = {
  ACTIVE: 'ACTIVE',
  CLOSED: 'CLOSED',
}

export type ClaimGetData = {
  data: ClaimData
}

export type ClaimType = 'ACTIVE' | 'CLOSED'

export const ClaimsAndAppealsErrorServiceTypesConstants: {
  APPEALS: string
  CLAIMS: string
} = {
  APPEALS: 'appeals',
  CLAIMS: 'claims',
}

export type ClaimsAndAppealsListPayload = {
  data: Array<ClaimsAndAppealsList>
  meta: {
    errors?: Array<ClaimsAndAppealsGetDataMetaError>
    pagination: {
      currentPage: number
      perPage: number
      totalEntries: number
    }
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
  }
}

export type ClaimData = {
  id: string
  type: string
  attributes: ClaimAttributesData
}

export type ClaimPhaseData = {
  [key: string]: ClaimEventData[]
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

export type ClaimEventDocumentData = {
  trackedItemId?: number
  fileType?: string
  documentType?: string
  filename?: string
  uploadDate: string
}
