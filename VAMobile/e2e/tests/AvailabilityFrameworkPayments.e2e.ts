/** AF tests for Payments tab: PaymentHistory, PaymentDetails, DirectDeposit */
import { describeAF } from './AvailabilityFrameworkShared'

const AFNavigationPayments = [
  ['Payments.e2e', 'WG_PaymentHistory', 'Payments', 'VA payment history'],
  ['Payments.e2e', 'WG_PaymentDetails', 'Payments', 'VA payment history', 'Regular Chapter 31'],
  [
    'Payments.e2e',
    'WG_PaymentIssue',
    'Payments',
    'VA payment history',
    'Regular Chapter 31',
    "What if my payment information doesn't look right?",
  ],
  ['Payments.e2e', 'WG_PaymentMissing', 'Payments', 'VA payment history', "What if I'm missing a payment?"],
  ['DirectDeposit.e2e', 'WG_DirectDeposit', 'Payments', 'Direct deposit information'],
  [
    'DirectDeposit.e2e',
    'WG_EditDirectDeposit',
    'Payments',
    'Direct deposit information',
    'Add your bank account information',
  ],
]

describeAF('AF Payments', AFNavigationPayments)
