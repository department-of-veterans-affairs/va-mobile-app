export type AllergyListPayload = {
  data: Array<AllergyData>
  links?: {
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
    dataFromStore?: boolean
  }
}

export type AllergyData = {
  id?: string | null
  type?: string | null
  attributes?: AllergyAttributesV0 | AllergyAttributesV1 | null
}

export type AllergyAttributesV0 = {
  code?: {
    text?: string | null
  } | null
  category?: Array<string> | null
  recordedDate?: string | null
  notes?: Array<NoteText> | null
  recorder?: Reference | null
  reactions?: Array<Reaction> | null
}

export type AllergyAttributesV1 = {
  id: string
  name?: string | null
  date?: string | null
  categories?: Array<string> | null
  reactions?: Array<string> | null
  location?: string | null
  observedHistoric?: string | null
  notes?: Array<string> | null
  provider?: string | null
}

export type Reaction = {
  manifestation: Array<ManifestationText> | null
}
export type ManifestationText = {
  text: string
}

export type NoteText = {
  authorReference?: Reference | null
  time: string
  text: string
}

export type Reference = {
  reference?: string
  display?: string
}
