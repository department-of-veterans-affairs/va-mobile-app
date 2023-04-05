import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'

import * as api from '../api'
import { APIError, DecisionLettersList, ScreenIDTypes } from '../api'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'

export type DecisionLettersState = {
  loading: boolean
  decisionLetters: DecisionLettersList
  error?: api.APIError
}

export const initialDecisionLettersState: DecisionLettersState = {
  loading: false,
  decisionLetters: [] as DecisionLettersList,
}

const decisionLettersNonFatalErrorString = 'Decision Letters Service Error'

/**
 * Redux action for getting decision letter information
 */
export const getDecisionLetters =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getDecisionLetters(screenID))))

    try {
      dispatch(dispatchStartGetDecisionLetters())
      const decisionLettersData = await api.get<api.DecisionLettersGetData>('/v0/claims/decision-letters')
      dispatch(
        dispatchFinishGetDecisionLetters({
          decisionLetters: decisionLettersData?.data,
        }),
      )
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `getDecisionLetters: ${decisionLettersNonFatalErrorString}`)
        dispatch(dispatchFinishGetDecisionLetters({ decisionLetters: undefined, error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

/**
 * Redux slice that will create the actions and reducers
 */
const decisionLettersSlice = createSlice({
  name: 'decisionLetters',
  initialState: initialDecisionLettersState,
  reducers: {
    dispatchStartGetDecisionLetters: (state) => {
      state.loading = true
    },

    dispatchFinishGetDecisionLetters: (state, action: PayloadAction<{ decisionLetters?: DecisionLettersList; error?: APIError }>) => {
      const { decisionLetters, error } = action.payload

      state.loading = false
      state.decisionLetters = decisionLetters || state.decisionLetters
      state.error = error
    },
  },
})

export const { dispatchFinishGetDecisionLetters, dispatchStartGetDecisionLetters } = decisionLettersSlice.actions
export default decisionLettersSlice.reducer
