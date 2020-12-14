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
