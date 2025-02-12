export type LabsAndTestsListPayload = {
  data: Array<LabsAndTests>

  meta: {
    pagination: {
      currentPage: number
      perPage: number
      totalPages: number
      totalEntries: number
    }
    dataFromStore: boolean
  }
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
  }
}
