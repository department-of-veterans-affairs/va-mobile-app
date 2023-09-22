export type FacilitiesPayload = {
  data: {
    attributes: {
      facilities: Array<Facility>
    }
  }
}

export type Facility = {
  id: string
  name: string
  city: string
  state: string
  cerner: boolean
  miles: string
}
