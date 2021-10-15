export type VaccineListData = {
  data: VaccineList
}

export type VaccinesMap = {
  [key: string]: Vaccine
}

export type VaccineList = Array<Vaccine>

export type Vaccine = {
  id: string
  vaccineCode: string
  recorded: string
  primarySource: boolean
  status: string
  location: Location
  manufacturer: VaccineManufacturer
  lotNumber: string
  expirationDate?: string
  reaction: Array<VaccineReaction>
  doseQuantity: DoseQuantity
  notes: Array<VaccineNote>
  protocolApplied: VaccineProtocolApplied
}

export type VaccineProtocolApplied = {
  series: string
  targetDisease: string
  doseNumber: string
  seriesDoses: string
}

export type Location = {
  id: string
  name: string
  alias?: Array<string>
  description?: string
  address: LocationAddress
}

export type LocationAddress = {
  type: string
  text?: string
  line?: Array<string>
  city: string
  district?: string
  state: string
  postalCode: string
  country: string
}

export type VaccineManufacturer = {
  active: boolean
  name: string
  alias?: Array<string>
  address?: LocationAddress
}

export type VaccineNote = {
  text: string
  time: string
}

export type DoseQuantity = {
  text: string
}

export type VaccineReaction = {
  date?: string
  reported?: boolean
  detail: ReactionDetail
}

export type ReactionDetail = {
  display: string
}
