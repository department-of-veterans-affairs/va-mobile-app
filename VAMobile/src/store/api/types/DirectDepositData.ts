export type AccountTypes = 'Savings' | 'Checking'

// GET call appends 'account' at the end of its types
export type AccountTypes_GET = 'Savings account' | 'Checking account'

export type PaymentAccountData = {
  accountNumber: string
  accountType: AccountTypes | AccountTypes_GET
  financialInstitutionName: string
  financialInstitutionRoutingNumber: string
}

export type DirectDepositData = {
  type: string
  id: string
  attributes: {
    paymentAccount: PaymentAccountData
  }
}
