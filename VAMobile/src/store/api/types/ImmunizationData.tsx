export type ImmunizationListData = {
  data: ImmunizationList
}

export type ImmunizationList = Array<Immunization>

export type Immunization = {
  id: string
  vaccineCode: string
  recorded: string
  primarySource: boolean
  location: Location
  manufacturer: VaccineManufacturer
  lotNumber: string
  expirationDate?: string
  reaction: Array<ImmunizationReaction>
  doseQuantity: DoseQuantity
  notes: Array<ImmunizationNote>
  protocolApplied: ImmunizationProtocolApplied
}

export type ImmunizationProtocolApplied = {
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

export type ImmunizationNote = {
  text: string
  time: string
}

export type DoseQuantity = {
  text: string
}

export type ImmunizationReaction = {
  date?: string
  reported?: boolean
  detail: ReactionDetail
}

export type ReactionDetail = {
  display: string
}
