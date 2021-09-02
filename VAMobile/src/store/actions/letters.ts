import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { BenefitSummaryAndServiceVerificationLetterOptions, LetterBeneficiaryData, LetterTypes, LettersDownloadParams, LettersList, Params, ScreenIDTypes } from 'store/api'
import { Events, UserAnalytics } from 'constants/analytics'
import { dispatchClearErrors, dispatchSetError, dispatchSetTryAgainFunction } from './errors'
import { downloadFile } from '../../utils/filesystem'
import { getCommonErrorFromAPIError } from 'utils/errors'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import { registerReviewEvent } from 'utils/inAppReviews'
import FileViewer from 'react-native-file-viewer'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

const DOWNLOAD_LETTER_RETRIES = 3

const dispatchStartGetLetters = (): ReduxAction => {
  return {
    type: 'LETTERS_START_GET_LETTERS_LIST',
    payload: {},
  }
}

const dispatchFinishGetLetters = (letters?: LettersList, error?: Error): ReduxAction => {
  return {
    type: 'LETTERS_FINISH_GET_LETTERS_LIST',
    payload: {
      letters,
      error,
    },
  }
}

/**
 * Redux action to get the list of letters for the user
 */
export const getLetters = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getLetters(screenID))))
    dispatch(dispatchStartGetLetters())

    try {
      const letters = await api.get<api.LettersData>('/v0/letters')

      dispatch(dispatchFinishGetLetters(letters?.data.attributes.letters))
    } catch (error) {
      dispatch(dispatchFinishGetLetters(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartGetLetterBeneficiaryData = (): ReduxAction => {
  return {
    type: 'LETTER_START_GET_BENEFICIARY_DATA',
    payload: {},
  }
}

const dispatchFinishGetLetterBeneficiaryData = (letterBeneficiaryData?: LetterBeneficiaryData, error?: Error): ReduxAction => {
  return {
    type: 'LETTER_FINISH_GET_BENEFICIARY_DATA',
    payload: {
      letterBeneficiaryData,
      error,
    },
  }
}

/**
 * Redux action to get the letter beneficiary data
 */
export const getLetterBeneficiaryData = (screenID?: ScreenIDTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchClearErrors(screenID))
    dispatch(dispatchSetTryAgainFunction(() => dispatch(getLetterBeneficiaryData(screenID))))
    dispatch(dispatchStartGetLetterBeneficiaryData())

    try {
      const letterBeneficiaryData = await api.get<api.LetterBeneficiaryDataPayload>('/v0/letters/beneficiary')
      dispatch(dispatchFinishGetLetterBeneficiaryData(letterBeneficiaryData?.data.attributes))
    } catch (error) {
      dispatch(dispatchFinishGetLetterBeneficiaryData(undefined, error))
      dispatch(dispatchSetError(getCommonErrorFromAPIError(error), screenID))
    }
  }
}

const dispatchStartDownloadLetter = (): ReduxAction => {
  return {
    type: 'LETTER_START_DOWNLOAD_LETTER',
    payload: {},
  }
}

const dispatchFinishDownloadLetter = (error?: Error): ReduxAction => {
  return {
    type: 'LETTER_FINISH_DOWNLOAD_LETTER',
    payload: {
      error,
    },
  }
}

/**
 * Redux action to download a letter
 */
export const downloadLetter = (letterType: LetterTypes, lettersOption?: BenefitSummaryAndServiceVerificationLetterOptions): AsyncReduxAction => {
  return async (dispatch, getState): Promise<void> => {
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
      /**
       * For letters we show a special screen regardless of the error. All download errors will be caught
       * here so there is no special path for network connection errors
       */
      dispatch(dispatchFinishDownloadLetter(error))
    }
  }
}
