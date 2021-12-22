export type VaccineListData = {
  data: VaccineList
  links: VaccinePaginationLinks
  meta: VaccineGetDataMeta
}

export type VaccinePaginationMeta = {
  currentPage: number
  perPage: number
  totalPages: number
  totalEntries: number
}

export type VaccinePaginationLinks = {
  self: string
  first: string
  prev: string
  next: string
  last: string
}

export type VaccineGetDataMeta = {
  pagination: VaccinePaginationMeta
}

export type VaccinesMap = {
  [key: string]: Vaccine
}

export type VaccineLocationsMap = {
  [key: string]: VaccineLocation
}

export type VaccineList = Array<Vaccine>

/**
 * TODO: for now this is as defensive as possible because this data is unstructured and we are not sure what we will
 * see with production data. We are opting to show blank screens rather than crashes if it is not what we are expecting.
 */

export type Vaccine = {
  id?: string | null
  type?: string | null
  attributes?: VaccineAttributes
  relationships?: VaccineRelationships
}

export type VaccineAttributes = {
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

export type VaccineRelationships = {
  location?: VaccineLocationRef
}

export type VaccineLocationRef = {
  data?: VaccineLocationRefData | null
}

export type VaccineLocationRefData = {
  id?: string | null
  type?: string | null
}

export type VaccineLocationData = {
  data: VaccineLocation
}

export type VaccineLocation = {
  type?: string | null
  id?: string | null
  attributes: VaccineLocationAttributes
}

export type VaccineLocationAttributes = {
  name?: string | null
  address: VaccineLocationAddress | null
}

export type VaccineLocationAddress = {
  street?: string | null
  city?: string | null
  state?: string | null
  zipCode?: string | null
}
