export interface OverpaymentDebtHistoryEntry {
  date?: string
  letterCode?: string
  description?: string
}

export interface OverpaymentDebtRecord {
  id: string
  fileNumber?: string
  payeeNumber?: string
  personEntitled?: string
  deductionCode?: string
  benefitType?: string
  diaryCode?: string
  diaryCodeDescription?: string

  amountOverpaid?: number
  amountWithheld?: number
  originalAr?: number
  currentAr?: number

  debtHistory?: OverpaymentDebtHistoryEntry[]
}

export interface OverpaymentDebtPayload {
  data: OverpaymentDebtRecord
  status: number
}

export interface OverpaymentDebtsPayload {
  data: OverpaymentDebtRecord[]
  status: number
}
