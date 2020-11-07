import { AccountTypes } from 'store/api/types'

export type AccountOption = {
  label: string
  value: AccountTypes
}

export const AccountOptions: Array<AccountOption> = [
  {
    label: 'common:accountType.checking',
    value: 'Checking',
  },
  {
    label: 'common:accountType.savings',
    value: 'Savings',
  },
]
