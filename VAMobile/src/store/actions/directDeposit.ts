import * as api from '../api'
import { AccountTypes } from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'

const dispatchStartGetBankInfo = (): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_START_GET_BANK_DATA',
    payload: {},
  }
}

const dispatchFinishGetBankInfo = (paymentAccount?: api.PaymentAccountData, error?: Error): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_FINISH_GET_BANK_DATA',
    payload: {
      paymentAccount,
      error,
    },
  }
}

/**
 * Redux action for getting direct deposit information
 *
 * @returns AsyncReduxAction
 */
export const getBankData = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      dispatch(dispatchStartGetBankInfo())
      // TODO: update to make api call to get data once service is integrated
      // const bankInfo = await api.get<api.DirectDepositData>('/v0/payment-information/benefits')
      const bankInfo: api.PaymentAccountData = {
        accountNumber: '*************1234',
        accountType: 'Savings account',
        financialInstitutionName: 'Bank of America',
        financialInstitutionRoutingNumber: '948529982',
      }
      dispatch(dispatchFinishGetBankInfo(bankInfo))
    } catch (err) {
      dispatch(dispatchFinishGetBankInfo({} as api.PaymentAccountData, err))
    }
  }
}

const dispatchStartSaveBankInfo = (): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_START_SAVE_BANK_INFO',
    payload: {},
  }
}

const dispatchFinishSaveBankInfo = (paymentAccount?: api.PaymentAccountData, error?: Error): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO',
    payload: {
      paymentAccount,
      error,
    },
  }
}

/**
 * Redux action for updating direct deposit information
 *
 * @param accountNumber - string specifying the new account number to use
 * @param routingNumber - string specifying the new routing number to use
 * @param accountType - string specifying the new accountType to use (can be Checking or Savings)
 *
 * @returns AsyncReduxAction
 */
export const updateBankInfo = (accountNumber: string, routingNumber: string, accountType: AccountTypes): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
    try {
      dispatch(dispatchStartSaveBankInfo())
      // TODO: update to make api call to updated data once service is integrated
      // const params: api.PaymentAccountData = {
      //   accountNumber,
      //   accountType,
      //   financialInstitutionRoutingNumber: routingNumber,
      //   financialInstitutionName: 'Bank', // api requires a name but ignores the value in the backend
      // }
      // const bankInfo = await api.put<api.DirectDepositData>('/v0/payment-information/benefits', params)
      console.debug('Direct deposit updated ', accountNumber, routingNumber, accountType)
      // TODO mock update, remove once service is integrated
      const mockUpdate: api.PaymentAccountData = {
        accountNumber,
        accountType: (accountType + ' account') as AccountTypes,
        financialInstitutionName: getState().directDeposit.paymentAccount.financialInstitutionName,
        financialInstitutionRoutingNumber: routingNumber,
      }
      dispatch(dispatchFinishSaveBankInfo(mockUpdate))
    } catch (err) {
      dispatch(dispatchFinishSaveBankInfo({} as api.PaymentAccountData, err))
    }
  }
}

const dispatchFinishEditBankInfo = (): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_FINISH_EDIT_BANK_INFO',
    payload: {},
  }
}

/**
 * Redux action for exiting the direct deposit edit mode
 */
export const finishEditBankInfo = (): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchFinishEditBankInfo())
  }
}
