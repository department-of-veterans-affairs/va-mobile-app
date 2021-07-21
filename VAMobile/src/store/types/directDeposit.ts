import * as api from '../api'
import { ActionDef } from './index'

/**
 * Redux payload for DIRECT_DEPOSIT_START_GET_BANK_DATA action
 */
export type DirectDepositStartGetBankDataPayload = Record<string, unknown>

/**
 * Redux payload for DIRECT_DEPOSIT_FINISH_GET_BANK_DATA action
 */
export type DirectDepositFinishGetBankDataPayload = {
  paymentAccount?: api.PaymentAccountData
  error?: api.APIError
}

/**
 * Redux payload for DIRECT_DEPOSIT_START_SAVE_BANK_INFO action
 */
export type DirectDepositStartSaveBankInfoPayload = Record<string, unknown>

/**
 * Redux payload for DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO action
 */
export type DirectDepositFinishSaveBankInfoPayload = {
  paymentAccount?: api.PaymentAccountData
  error?: api.APIError
  invalidRoutingNumberError: boolean
}

/**
 * Redux payload for DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO action
 */
export type DirectDepositFinishEditBankInfoPayload = Record<string, unknown>

/**
 *  All direct deposit actions
 */
export interface DirectDepositActions {
  /** Redux action to signify that get bank data request has started */
  DIRECT_DEPOSIT_START_GET_BANK_DATA: ActionDef<'DIRECT_DEPOSIT_START_GET_BANK_DATA', DirectDepositStartGetBankDataPayload>
  /** Redux action to signify that get bank data request has finished */
  DIRECT_DEPOSIT_FINISH_GET_BANK_DATA: ActionDef<'DIRECT_DEPOSIT_FINISH_GET_BANK_DATA', DirectDepositFinishGetBankDataPayload>
  /** Redux action to signify that update bank data request has started */
  DIRECT_DEPOSIT_START_SAVE_BANK_INFO: ActionDef<'DIRECT_DEPOSIT_START_SAVE_BANK_INFO', DirectDepositStartSaveBankInfoPayload>
  /** Redux action to signify that update bank data request has finished */
  DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO: ActionDef<'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO', DirectDepositFinishSaveBankInfoPayload>
  /** Redux action to signify that save bank info request has finished */
  DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO: ActionDef<'DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO', DirectDepositFinishEditBankInfoPayload>
}
