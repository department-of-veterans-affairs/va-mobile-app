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

export type GenderIdentityOptions = {
  [key: string]: string
}

export type GenderIdentityOptionsPayload = {
  data: {
    id: string
    type: string
    attributes: {
      options: GenderIdentityOptions
    }
  }
}

export type GenderIdentityUpdatePayload = {
  code: string
}
