export type VaccineListData = {
  data: VaccineList
}

export type VaccinesMap = {
  [key: string]: Vaccine
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
}
