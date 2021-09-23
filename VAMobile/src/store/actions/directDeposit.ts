import { includes } from 'lodash'

import * as api from '../api'
import { APIError, AccountTypes, ScreenIDTypes } from '../api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { DirectDepositErrors } from 'constants/errors'
import { Events, UserAnalytics } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError, getErrorKeys } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analytics'

const dispatchStartGetBankInfo = (): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_START_GET_BANK_DATA',
    payload: {},
  }
}

const dispatchFinishGetBankInfo = (paymentAccount?: api.PaymentAccountData, error?: APIError): ReduxAction => {
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
export const getBankData = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getBankData(screenID))))

    try {
      dispatch(dispatchStartGetBankInfo())
      const bankInfo = await api.get<api.DirectDepositData>('/v0/payment-information/benefits')
      dispatch(dispatchFinishGetBankInfo(bankInfo?.data.attributes.paymentAccount))
    } catch (err) {
      if (isErrorObject(err)) {
        dispatch(dispatchFinishGetBankInfo(undefined, err))
        dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
      }
    }
  }
}

const dispatchStartSaveBankInfo = (): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_START_SAVE_BANK_INFO',
    payload: {},
  }
}

const dispatchFinishSaveBankInfo = (paymentAccount?: api.PaymentAccountData, error?: APIError, invalidRoutingNumberError = false): ReduxAction => {
  return {
    type: 'DIRECT_DEPOSIT_FINISH_SAVE_BANK_INFO',
    payload: {
      paymentAccount,
      error,
      invalidRoutingNumberError,
    },
  }
}

/**
 * Redux action for updating direct deposit information
 *
 * @param accountNumber - string specifying the new account number to use
 * @param routingNumber - string specifying the new routing number to use
 * @param accountType - string specifying the new accountType to use (can be Checking or Savings)
 * @param screenID - string specifying the screen that a common error would display on
 *
 * @returns AsyncReduxAction
 */
export const updateBankInfo = (accountNumber: string, routingNumber: string, accountType: AccountTypes, screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(updateBankInfo(accountNumber, routingNumber, accountType, screenID))))

    try {
      dispatch(dispatchStartSaveBankInfo())
      const params: api.PaymentAccountData = {
        accountNumber,
        accountType,
        financialInstitutionRoutingNumber: routingNumber,
        financialInstitutionName: 'Bank', // api requires a name but ignores the value in the backend
      }
      const bankInfo = await api.put<api.DirectDepositData>('/v0/payment-information/benefits', params)

      await setAnalyticsUserProperty(UserAnalytics.vama_uses_profile())
      const [totalTime, actionTime] = getAnalyticsTimers(_getState())
      await logAnalyticsEvent(Events.vama_prof_update_dir_dep(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveBankInfo(bankInfo?.data.attributes.paymentAccount))
    } catch (err) {
      if (isErrorObject(err)) {
        const errorKeys = getErrorKeys(err)
        const invalidRoutingNumberError = includes(errorKeys, DirectDepositErrors.INVALID_ROUTING_NUMBER)

        dispatch(dispatchFinishSaveBankInfo(undefined, err, invalidRoutingNumberError))

        // both invalidRoutingNumber error and common app level errors share the same status codes
        // invalidRoutingNumber error is more specific and takes priority over common error
        if (!invalidRoutingNumberError) {
          dispatch(dispatchSetError(getCommonErrorFromAPIError(err), screenID))
        }
      }
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
export const finishEditBankInfo = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchFinishEditBankInfo())
  }
}
