export type DecisionLetterAttributes = {
  seriesId: string
  version: string
  typeDescription: string
  typeId: string
  docType: string
  subject?: string
  receivedAt: string
  source: string
  mimeType: string
  altDocTypes: string
  restricted: boolean
  uploadDate: string
}

export type DecisionLetter = {
  id: string
  type: 'decisionLetter'
  attributes: DecisionLetterAttributes
}

export type DecisionLettersList = Array<DecisionLetter>

export type DecisionLettersGetData = {
  data: DecisionLettersList
}
