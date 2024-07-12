export type DecisionLettersList = Array<{
  id: string
  type: 'decisionLetter'
  attributes: {
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
}>

export type DecisionLettersGetData = {
  data: DecisionLettersList
}
