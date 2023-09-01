export type DemographicsPayload = {
  data: {
    attributes: {
      genderIdentity: string
      preferredName: string
    }
  }
}

export type UserDemographics = {
  genderIdentity: string
  preferredName: string
}
