import * as api from 'store/api'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import FileViewer from 'react-native-file-viewer'
import _ from 'underscore'

import { AppThunk } from 'store'
import {
  BenefitSummaryAndServiceVerificationLetterOptions,
  LetterBeneficiaryData,
  LetterMilitaryService,
  LetterTypes,
  LettersDownloadParams,
  LettersList,
  Params,
  ScreenIDTypes,
} from 'store/api'
import { Events, UserAnalytics } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errorSlice'
import { downloadFile } from '../../utils/filesystem'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { getSubstringBeforeChar } from 'utils/formattingUtils'
import { isErrorObject, sortByDate } from 'utils/common'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { registerReviewEvent } from 'utils/inAppReviews'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

const DOWNLOAD_LETTER_RETRIES = 3

export type LettersState = {
  loading: boolean
  error?: Error
  letters: LettersList
  letterBeneficiaryData?: LetterBeneficiaryData
  mostRecentServices: Array<LetterMilitaryService> // most recent 3
  downloading: boolean
  letterDownloadError?: Error
}

export const initialLettersState: LettersState = {
  loading: false,
  letters: [] as LettersList,
  mostRecentServices: [],
  downloading: false,
}

export const getLetters =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getLetters(screenID))))
    dispatch(dispatchStartGetLetters())

    try {
      const letters = await api.get<api.LettersData>('/v0/letters')

      dispatch(dispatchFinishGetLetters({ letters: letters?.data.attributes.letters }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetLetters({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const getLetterBeneficiaryData =
  (screenID?: ScreenIDTypes): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getLetterBeneficiaryData(screenID))))
    dispatch(dispatchStartGetLetterBeneficiaryData())

    try {
      const letterBeneficiaryData = await api.get<api.LetterBeneficiaryDataPayload>('/v0/letters/beneficiary')
      dispatch(dispatchFinishGetLetterBeneficiaryData({ letterBeneficiaryData: letterBeneficiaryData?.data.attributes }))
    } catch (error) {
      if (isErrorObject(error)) {
        dispatch(dispatchFinishGetLetterBeneficiaryData({ error }))
        dispatch(dispatchSetError({ errorType: getCommonErrorFromAPIError(error), screenID }))
      }
    }
  }

export const downloadLetter =
  (letterType: LetterTypes, lettersOption?: BenefitSummaryAndServiceVerificationLetterOptions): AppThunk =>
  async (dispatch, getState) => {
    dispatch(dispatchStartDownloadLetter())

    const benefitInformation = getState().letters?.letterBeneficiaryData?.benefitInformation
    try {
      const lettersAPI = `${API_ROOT}/v0/letters/${letterType}/download`
      const body: LettersDownloadParams = {
        militaryService: false, // overridden by 'lettersOption' if exist
        monthlyAward: false, // overridden by 'lettersOption' if exist
        serviceConnectedEvaluation: false, // overridden by 'lettersOption' if exist
        chapter35Eligibility: false, // overridden by 'lettersOption' if exist
        serviceConnectedDisabilities: false, // overridden by 'lettersOption' if exist
        nonServiceConnectedPension: !!benefitInformation?.hasNonServiceConnectedPension,
        unemployable: !!benefitInformation?.hasIndividualUnemployabilityGranted,
        specialMonthlyCompensation: !!benefitInformation?.hasSpecialMonthlyCompensation,
        adaptedHousing: !!benefitInformation?.hasAdaptedHousing,
        deathResultOfDisability: !!benefitInformation?.hasDeathResultOfDisability,
        survivorsAward: !!benefitInformation?.hasSurvivorsIndemnityCompensationAward || !!benefitInformation?.hasSurvivorsPensionAward,
        ...lettersOption,
      }

      const filePath = await downloadFile('POST', lettersAPI, `${letterType}.pdf`, body as unknown as Params, DOWNLOAD_LETTER_RETRIES)
      await registerReviewEvent()
      dispatch(dispatchFinishDownloadLetter())

      if (filePath) {
        await FileViewer.open(filePath)
      }

      await logAnalyticsEvent(Events.vama_letter_download(letterType))
      await setAnalyticsUserProperty(UserAnalytics.vama_uses_letters())
    } catch (error) {
      if (isErrorObject(error)) {
        /**
         * For letters we show a special screen regardless of the error. All download errors will be caught
         * here so there is no special path for network connection errors
         */
        dispatch(dispatchFinishDownloadLetter(error))
      }
    }
  }

const lettersSlice = createSlice({
  name: 'letters',
  initialState: initialLettersState,
  reducers: {
    dispatchStartGetLetters: (state) => {
      state.loading = true
    },

    dispatchFinishGetLetters: (state, action: PayloadAction<{ letters?: LettersList; error?: Error }>) => {
      const { letters, error } = action.payload
      const newLetters = letters || []
      state.letters = _.sortBy(newLetters, (letter) => {
        return letter.name
      })

      state.error = error
      state.loading = false
    },

    dispatchStartGetLetterBeneficiaryData: (state) => {
      state.loading = true
    },

    dispatchFinishGetLetterBeneficiaryData: (state, action: PayloadAction<{ letterBeneficiaryData?: LetterBeneficiaryData; error?: Error }>) => {
      const { letterBeneficiaryData, error } = action.payload
      let mostRecentServices: Array<LetterMilitaryService> = [...(letterBeneficiaryData?.militaryService || [])]

      if (letterBeneficiaryData) {
        sortByDate(mostRecentServices, 'enteredDate')

        // Strip off timezone info so dates won't be incorrectly time shifted in certain timezones
        letterBeneficiaryData.benefitInformation.awardEffectiveDate = getSubstringBeforeChar(letterBeneficiaryData?.benefitInformation?.awardEffectiveDate || '', 'T')
        mostRecentServices = mostRecentServices.map((periodOfService) => {
          periodOfService.enteredDate = getSubstringBeforeChar(periodOfService.enteredDate, 'T')
          periodOfService.releasedDate = getSubstringBeforeChar(periodOfService.releasedDate, 'T')
          return periodOfService
        })
      }

      state.letterBeneficiaryData = letterBeneficiaryData
      state.mostRecentServices = mostRecentServices
      state.error = error
      state.loading = false
    },

    dispatchStartDownloadLetter: (state) => {
      state.letterDownloadError = undefined
      state.downloading = true
    },

    dispatchFinishDownloadLetter: (state, action: PayloadAction<Error | undefined>) => {
      state.letterDownloadError = action.payload
      state.downloading = false
    },
  },
})

export const {
  dispatchFinishGetLetters,
  dispatchStartGetLetters,
  dispatchFinishGetLetterBeneficiaryData,
  dispatchStartGetLetterBeneficiaryData,
  dispatchFinishDownloadLetter,
  dispatchStartDownloadLetter,
} = lettersSlice.actions
export default lettersSlice.reducer
