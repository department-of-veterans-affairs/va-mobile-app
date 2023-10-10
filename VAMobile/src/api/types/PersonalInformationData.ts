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
    }
  }
}

export type PersonalInformationData = {
  firstName: string
  middleName: string | null
  lastName: string
  signinEmail: string
  signinService: string
  birthDate: string | null
  fullName: string
}
