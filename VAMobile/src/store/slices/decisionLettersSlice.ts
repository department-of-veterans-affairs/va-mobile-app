import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import FileViewer from 'react-native-file-viewer'

import * as api from '../api'
import { APIError, DecisionLettersList, ScreenIDTypes } from '../api'
import { AppThunk } from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { downloadDemoFile, downloadFile } from '../../utils/filesystem'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { isErrorObject } from 'utils/common'
import { logNonFatalErrorToFirebase } from 'utils/analytics'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

const downloadDecisionLetterRetries = 3
const decisionLettersNonFatalErrorString = 'Decision Letters Service Error'

export type DecisionLettersState = {
  loading: boolean
  decisionLetters: DecisionLettersList
  error?: api.APIError
  downloading: boolean
  downloadError?: Error
}

export const initialDecisionLettersState: DecisionLettersState = {
  loading: false,
  decisionLetters: [] as DecisionLettersList,
  downloading: false,
}

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
 * Redux action to download a decision letter
 */
export const downloadDecisionLetter =
  (id: string): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartDownloadDecisionLetter())
    const { demoMode } = getState().demo

    try {
      const decisionLettersEndpoint = `${API_ROOT}/v0/claims/decision-letters/${id}/download`
      const filePath = demoMode
        ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
        : await downloadFile('GET', decisionLettersEndpoint, 'decision_letter.pdf', undefined, downloadDecisionLetterRetries)

      dispatch(dispatchFinishDownloadDecisionLetter())

      if (filePath) {
        await FileViewer.open(filePath)
      }
    } catch (error) {
      if (isErrorObject(error)) {
        logNonFatalErrorToFirebase(error, `downloadDecisionLetter: ${decisionLettersNonFatalErrorString}`)
        /**
         * For letters we show a special screen regardless of the error. All download errors will be caught
         * here so there is no special path for network connection errors
         */
        dispatch(dispatchFinishDownloadDecisionLetter(error))
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
    dispatchStartDownloadDecisionLetter: (state) => {
      state.downloadError = undefined
      state.downloading = true
    },
    dispatchFinishDownloadDecisionLetter: (state, action: PayloadAction<Error | undefined>) => {
      state.downloadError = action.payload
      state.downloading = false
    },
  },
})

export const { dispatchFinishGetDecisionLetters, dispatchStartGetDecisionLetters, dispatchStartDownloadDecisionLetter, dispatchFinishDownloadDecisionLetter } =
  decisionLettersSlice.actions
export default decisionLettersSlice.reducer
