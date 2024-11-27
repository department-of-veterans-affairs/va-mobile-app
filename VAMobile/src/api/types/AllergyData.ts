export type AllergyListPayload = {
  data: Array<Allergy>
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

export type Allergy = {
  id?: string | null
  type?: string | null
  attributes?: {
    code?: {
      text?: string | null
    } | null
    category?: string | null
    recordedDate?: string | null
    notes?: Array<NoteText> | null
    recorder?: {
      display?: string | null
    } | null
    reactions?: Array<Reaction> | null
  }
}

export type Reaction = {
  manifestation: Array<ManifestationText> | null
}
export type ManifestationText = {
  text: string
}

export type NoteText = {
  text: string
}
