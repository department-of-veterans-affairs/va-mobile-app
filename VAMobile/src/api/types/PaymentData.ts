export type PaymentsGetData = {
  data: Array<PaymentsData>
  paymentsByDate?: PaymentsByDate
  meta: {
    pagination?: PaymentsMetaPagination
    availableYears: Array<number> | null
    recurringPayment: RecurringPaymentData
  }
  links: {
    self: string | null
    first: string | null
    prev: string | null
    next: string | null
    last: string | null
  }
}

export type RecurringPaymentData = {
  amount: string
  date: string
}

export type PaymentsData = {
  type: string
  id: string
  attributes: {
    date: string
    amount: string
    paymentType: string
    paymentMethod: string
    bank: string | null
    account: string | null
  }
}

export type PaymentsMetaPagination = {
  currentPage: number
  perPage: number
  totalEntries: number
}

export type PaymentsByDate = {
  [key: string]: Array<PaymentsData>
}
