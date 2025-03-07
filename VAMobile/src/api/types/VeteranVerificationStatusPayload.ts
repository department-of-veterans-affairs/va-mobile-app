export type VeteranStatus = 'confirmed' | 'not confirmed'

export type VeteranVerificationStatusDataAttributes = {
  veteranStatus: VeteranStatus
  notConfirmedReason?: string
}

export type VeteranVerificationStatusPayload = {
  data: {
    id: string
    type: string
    attributes: VeteranVerificationStatusDataAttributes
    message?: string[]
  }
}
