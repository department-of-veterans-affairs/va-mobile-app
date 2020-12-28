import * as api from '../api'
import createReducer from './createReducer'

export type DirectDepositState = {
  saving: boolean
  paymentAccount: api.PaymentAccountData
  bankInfoUpdated?: boolean
  error?: Error
}

export const initialDirectDepositState: DirectDepositState = {
  paymentAccount: {} as api.PaymentAccountData,
  saving: false,
}

export default createReducer<DirectDepositState>(initialDirectDepositState, {
  DIRECT_DEPOSIT_START_GET_BANK_DATA: (state, payload) => {
    return {
      ...state,
      ...payload,
      saving: true,
    }
  },
  DIRECT_DEPOSIT_FINISH_GET_BANK_DATA: (state, { paymentAccount, error }) => {
    return {
      ...state,
      saving: false,
      paymentAccount: paymentAccount || state.paymentAccount,
      error,
    }
  },
  DIRECT_DEPOSIT_START_SAVE_BANK_INFO: (state, payload) => {
    return {
      ...state,
      ...payload,
      saving: true,
    }
  },
  DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO: (state, { paymentAccount, error }) => {
    return {
      ...state,
      saving: false,
      paymentAccount: paymentAccount || state.paymentAccount,
      error,
      bankInfoUpdated: !error,
    }
  },
  DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO: (state, payload) => {
    return {
      ...state,
      ...payload,
      bankInfoUpdated: false,
    }
  },
})
