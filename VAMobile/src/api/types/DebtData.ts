export type DebtHistory = {
  date: string
  letterCode: string
  description: string
}

export type DebtTransaction = {
  debtId: number
  transactionDate: string
  transactionTotalAmount?: number
  transactionPrincipalAmount?: number
  debtIncreaseAmount?: number
  offsetAmount?: number
  transactionDescription?: string
  transactionExplanation?: string
  hinesCode?: string
  offsetType?: string
  paymentType?: string
  transactionAdminAmount?: number
  transactionCourtAmount?: number
  transactionFiscalCode?: string
  transactionFiscalSource?: string
  transactionFiscalYear?: string
  transactionInterestAmount?: number
  transactionMarshallAmount?: number
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
