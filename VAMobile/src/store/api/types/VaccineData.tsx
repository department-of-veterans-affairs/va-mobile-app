export type VaccineListData = {
  data: VaccineList
}

export type VaccinesMap = {
  [key: string]: Vaccine
}

export type VaccineList = Array<Vaccine>

export type Vaccine = {
  id: string
  type: string
  attributes: VaccineAttributes
}

export type VaccineAttributes = {
  cvxCode: number
  date: string
  doseNumber: string | null
  doseSeries: number | null
  groupName: string
  manufacturer: string | null
  note: string | null
  shortDescription: string
}
