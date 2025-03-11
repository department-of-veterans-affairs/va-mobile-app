export type LabsAndTestsListPayload = {
  data: Array<LabsAndTests>

  meta: {
    dataFromStore: boolean
  }
}

export type Observation = {
  testCode: string | null
  valueQuantity: string | null
  referenceRange: string | null
  status: string | null
  comment: string | null
}

export type LabsAndTests = {
  id?: string | null
  type?: string | null
  attributes?: {
    display: string
    testCode: string
    dateCompleted?: string | null
    sampleSite?: string | null
    encodedData?: string | null
    location?: string | null
    observations?: Array<Observation> | null
  }
}
