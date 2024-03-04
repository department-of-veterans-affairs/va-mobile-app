export type VaccineListPayload = {
  data: Array<Vaccine>
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

export type Vaccine = {
  id?: string | null
  type?: string | null
  attributes?: {
    cvxCode?: number | null
    date?: string | null
    doseNumber?: number | string | null
    doseSeries?: number | string | null
    groupName?: string | null
    manufacturer?: string | null
    note?: string | null
    shortDescription?: string | null
    reaction?: string | null
  }
  relationships?: {
    location?: {
      data?: {
        id?: string | null
        type?: string | null
      } | null
    }
  }
}

export type VaccineLocationPayload = {
  data: {
    type?: string | null
    id?: string | null
    attributes: {
      name?: string | null
      address: {
        street?: string | null
        city?: string | null
        state?: string | null
        zipCode?: string | null
      } | null
    }
  }
}
