export type DemographicsPayload = {
  data: {
    id: string
    type: string
    attributes: {
      preferredName: string
    }
  }
}

export type UserDemographics = {
  preferredName: string
}

export type PreferredNameUpdatePayload = {
  text: string
}
