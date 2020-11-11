import { AccountTypes } from 'store/api/types'

export const ACCOUNT_TYPES: {
  checking: AccountTypes
  savings: AccountTypes
} = {
  checking: 'Checking',
  savings: 'Savings',
}

export type AccountOption = {
  label: string
  value: AccountTypes
}

export const AccountOptions: Array<AccountOption> = [
  {
    label: 'common:accountType.checking',
    value: ACCOUNT_TYPES.checking,
  },
  {
    label: 'common:accountType.savings',
    value: ACCOUNT_TYPES.savings,
  },
]
