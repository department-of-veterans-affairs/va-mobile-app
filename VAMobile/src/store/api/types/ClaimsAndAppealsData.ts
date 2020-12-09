export type ClaimEventsTimeLineItem = {
  trackedItemId: number
  description?: string
  displayName?: string
  overdue?: boolean
  status?: string
  fileType?: string
  documentType?: string
  filename?: string
  uploadDate: string
  type: string
  date: string
  uploaded?: boolean
  uploadsAllowed?: boolean
  openedDate?: string
  requestedDate?: string
  receivedDate?: string
  closedDate?: string
  suspenseDate?: string
  documents?: Array<string>
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
  eventsTimeline: Array<ClaimEventsTimeLineItem>
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
