import { ActionDef } from './index'

/**
 *  Redux payload for GET_BANK_DATA action
 */
export type BankDataPayload = {
  bank_name: string
  bank_account_number: string
  bank_account_type: string
}

/**
 *  All direct deposit actions
 */
export interface DirectDepositActions {
  /** Redux action to signify that bank data is being retrieved */
  GET_BANK_DATA: ActionDef<'GET_BANK_DATA', BankDataPayload>
}
