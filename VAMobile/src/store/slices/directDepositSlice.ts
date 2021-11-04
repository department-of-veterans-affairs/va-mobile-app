import { AppThunk } from 'store'
import { DirectDepositErrors } from 'constants/errors'
import { Events, UserAnalytics } from 'constants/analytics'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { getAnalyticsTimers, logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { getCommonErrorFromAPIError, getErrorKeys } from 'utils/errors'
import { includes } from 'lodash'
import { isErrorObject } from 'utils/common'

import * as api from '../api'
import { APIError, AccountTypes, ScreenIDTypes } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { resetAnalyticsActionStart, setAnalyticsTotalTimeStart } from './analyticsSlice'

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

export const getBankData =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getBankData(screenID))))

    try {
      dispatch(dispatchStartGetBankInfo())
      const bankInfo = await api.get<api.DirectDepositData>('/v0/payment-information/benefits')
      dispatch(dispatchFinishGetBankInfo({ paymentAccount: bankInfo?.data.attributes.paymentAccount }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetBankInfo({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const updateBankInfo =
  (accountNumber: string, routingNumber: string, accountType: AccountTypes, screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch, getState) => {
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
      const [totalTime, actionTime] = getAnalyticsTimers(getState())
      await logAnalyticsEvent(Events.vama_prof_update_dir_dep(totalTime, actionTime))
      await dispatch(resetAnalyticsActionStart())
      await dispatch(setAnalyticsTotalTimeStart())
      dispatch(dispatchFinishSaveBankInfo({ paymentAccount: bankInfo?.data.attributes.paymentAccount }))
    } catch (error) {
      if (isErrorObject(error)) {
        const invalidRoutingNumberError = checkIfRoutingNumberIsInvalid(error)
        dispatch(dispatchFinishSaveBankInfo({ error, invalidRoutingNumberError }))

        // both invalidRoutingNumber error and common app level errors share the same status codes
        // invalidRoutingNumber error is more specific and takes priority over common error
        if (!invalidRoutingNumberError) {
          dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
        }
      }
    }
  }

export const finishEditBankInfo =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchFinishEditBankInfo())
  }

const checkIfRoutingNumberIsInvalid = (error: APIError): boolean => {
  if (!error) {
    return false
  }

  const errorKeys = getErrorKeys(error)
  return includes(errorKeys, DirectDepositErrors.INVALID_ROUTING_NUMBER) || includes(error?.text, DirectDepositErrors.INVALID_ROUTING_NUMBER_TEXT)
}

const directDepositSlice = createSlice({
  name: 'directDeposit',
  initialState: initialDirectDepositState,
  reducers: {
    dispatchStartGetBankInfo: (state) => {
      state.loading = true
    },

    dispatchFinishGetBankInfo: (state, action: PayloadAction<{ paymentAccount?: api.PaymentAccountData; error?: APIError }>) => {
      const { paymentAccount, error } = action.payload

      state.loading = false
      state.paymentAccount = paymentAccount || state.paymentAccount
      state.error = error
    },

    dispatchStartSaveBankInfo: (state) => {
      state.saving = true
    },

    dispatchFinishSaveBankInfo: (state, action: PayloadAction<{ paymentAccount?: api.PaymentAccountData; error?: APIError; invalidRoutingNumberError?: boolean }>) => {
      const { paymentAccount, error, invalidRoutingNumberError } = action.payload
      const newInvalidRoutingNumberError = invalidRoutingNumberError || false

      state.saving = false
      state.paymentAccount = paymentAccount || state.paymentAccount
      state.bankInfoUpdated = !error
      state.error = error
      state.invalidRoutingNumberError = newInvalidRoutingNumberError
    },

    dispatchFinishEditBankInfo: (state) => {
      state.bankInfoUpdated = false
      state.invalidRoutingNumberError = false
    },
  },
})

export const { dispatchFinishGetBankInfo, dispatchStartGetBankInfo, dispatchFinishSaveBankInfo, dispatchStartSaveBankInfo, dispatchFinishEditBankInfo } = directDepositSlice.actions
export default directDepositSlice.reducer
