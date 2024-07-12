export type AccountTypes = 'Savings' | 'Checking'

export type PaymentAccountData = {
  accountNumber: string
  accountType: AccountTypes
  financialInstitutionName: string
  financialInstitutionRoutingNumber: string
}

export type DirectDepositData = {
  data: {
    type: string
    id: string
    attributes: {
      paymentAccount: PaymentAccountData
    }
  }
}
