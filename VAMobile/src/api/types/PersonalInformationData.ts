export type PersonalInformationPayload = {
  data: {
    id: string
    type: string
    attributes: {
      firstName: string
      middleName: string | null
      lastName: string
      signinEmail: string
      signinService: string
      birthDate: string | null
      hasFacilityTransitioningToCerner: boolean
      edipi: string | null
    }
  }
}

export type PersonalInformationData = PersonalInformationPayload['data']['attributes'] & {
  id: string
  fullName: string
}
