export type DebtHistory = {
  date?: string
  letterCode?: string
  description?: string
}

export type DebtRecord = {
  id: string
  type: string
  attributes: {
    fileNumber?: string
    payeeNumber?: string
    personEntitled?: string
    deductionCode: string
    benefitType: string
    diaryCode?: string
    diaryCodeDescription?: string

    amountOverpaid?: number
    amountWithheld?: number
    originalAr: number
    currentAr: number

    debtHistory?: DebtHistory[]
  }
}

export type DebtsPayload = {
  data: DebtRecord[]
  status: number
}
