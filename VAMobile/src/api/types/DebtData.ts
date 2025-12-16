export type DebtHistory = {
  date: string
  letterCode: string
  description: string
}

export type DebtTransaction = {
  debtId: number
  debtIncreaseAmount?: number | null
  hinesCode?: string | null
  offsetAmount?: number | null
  offsetType?: string | null
  paymentType?: string | null
  transactionAdminAmount?: number | null
  transactionCourtAmount?: number | null
  transactionDate: string
  transactionDescription?: string | null
  transactionExplanation?: string | null
  transactionFiscalCode?: string | null
  transactionFiscalSource?: string | null
  transactionFiscalYear?: string | null
  transactionInterestAmount?: number | null
  transactionMarshallAmount?: number | null
  transactionPrincipalAmount?: number | null
  transactionTotalAmount?: number | null
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
    fiscalTransactionData?: DebtTransaction[]
  }
}

export type DebtsPayload = {
  data: DebtRecord[]
  status: number
}
