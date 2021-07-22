import * as api from '../api'
import createReducer from './createReducer'

export type DirectDepositState = {
  loading: boolean
  saving: boolean
  paymentAccount: api.PaymentAccountData
  bankInfoUpdated: boolean
  error?: api.APIError
  invalidRoutingNumberError: boolean
}

export const initialDirectDepositState: DirectDepositState = {
  paymentAccount: {} as api.PaymentAccountData,
  loading: false,
  saving: false,
  invalidRoutingNumberError: false,
  bankInfoUpdated: false,
}

export default createReducer<DirectDepositState>(initialDirectDepositState, {
  DIRECT_DEPOSIT_START_GET_BANK_DATA: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  DIRECT_DEPOSIT_FINISH_GET_BANK_DATA: (state, { paymentAccount, error }) => {
    return {
      ...state,
      loading: false,
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
  DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO: (state, { paymentAccount, error, invalidRoutingNumberError }) => {
    return {
      ...state,
      saving: false,
      paymentAccount: paymentAccount || state.paymentAccount,
      bankInfoUpdated: !error,
      error,
      invalidRoutingNumberError,
    }
  },
  DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO: (state, payload) => {
    return {
      ...state,
      ...payload,
      bankInfoUpdated: false,
      invalidRoutingNumberError: false,
    }
  },
})
