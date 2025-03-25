export type LabsAndTestsListPayload = {
  data: Array<LabsAndTests>

  meta: {
    dataFromStore: boolean
  }
}

export type value = {
  text: string | null
  type: string | null
}

export type Observation = {
  testCode: string | null
  value: value | null
  referenceRange: string | null
  status: string | null
  comment: string | null
  sampleTested: string | null
  bodySite: string | null
}

export type LabsAndTests = {
  id?: string | null
  type?: string | null
  attributes?: {
    display: string
    testCode: string
    dateCompleted?: string | null
    orderedBy?: string | null
    encodedData?: string | null
    location?: string | null
    sampleTested: string | null
    bodySite: string | null
    observations?: Array<Observation> | null
  }
}
