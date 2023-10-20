export type DemographicsPayload = {
  data: {
    id: string
    type: string
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

export type PreferredNameUpdatePayload = {
  text: string
}
