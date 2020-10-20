import { AType, ActionBase } from './index'

/**
 *  Redux payload for {@link BankDataAction} action
 */
export type BankDataPayload = {
  bank_name: string
  bank_account_number: string
  bank_account_type: string
}

/**
 * Redux action to signify that bank data is being retrieved
 */
export type BankDataAction = ActionBase<'GET_BANK_DATA', BankDataPayload>

/**
 *  All direct deposit actions
 */
export type DirectDepositActions = AType<BankDataAction>
