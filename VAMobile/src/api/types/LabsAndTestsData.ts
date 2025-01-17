export type LabsAndTestsListPayload = {
  data: Array<LabsAndTests>
  links: {
    self: string
    first: string
    prev: string
    next: string
    last: string
  }
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
    code: string
    category?: string | null
    effectiveDateTime?: string | null
    issued?: string | null
    subject?: {
      display?: string | null
    } | null
    result?: Array<Result> | null
  }
}

export type Result = {
  reference: string | null
  display: string | null
}
