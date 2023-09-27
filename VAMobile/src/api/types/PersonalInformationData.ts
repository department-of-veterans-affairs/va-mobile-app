export type PersonalInformationPayload = {
  data: {
    id: string
    type: string
    attributes: {
      firstName: string
      middleName: string
      lastName: string
      signinEmail: string
      signinService: string
      birthDate: string
    }
  }
}

export type PersonalInformationData = {
  firstName: string
  middleName: string
  lastName: string
  signinEmail: string
  signinService: string
  birthDate: string
}
