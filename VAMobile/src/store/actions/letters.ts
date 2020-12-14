import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import {
  BenefitSummaryAndServiceVerificationLetterOptions,
  CharacterOfServiceConstants,
  LetterBeneficiaryData,
  LetterBeneficiaryDataPayload,
  LetterTypes,
  LettersDownloadParams,
  LettersList,
  Params,
} from 'store/api'
import { downloadFile } from '../../utils/filesystem'
import FileViewer from 'react-native-file-viewer'
import getEnv from 'utils/env'

const { API_ROOT } = getEnv()

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
export const getLetters = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetLetters())

    try {
      const letters = await api.get<api.LettersData>('/v0/letters')

      dispatch(dispatchFinishGetLetters(letters?.data.attributes.letters))
    } catch (error) {
      dispatch(dispatchFinishGetLetters(undefined, error))
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
export const getLetterBeneficiaryData = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartGetLetterBeneficiaryData())

    try {
      // const letterBeneficiaryData = await api.get<api.LetterBeneficiaryDataPayload>('/v0/letters/beneficiary')
      // TODO: use endpoint when available
      const letterBeneficiaryDataPayload: LetterBeneficiaryDataPayload = {
        data: {
          type: 'evssLettersBeneficiaryResponses',
          id: '0',
          attributes: {
            benefitInformation: {
              awardEffectiveDate: '2013-06-06T04:00:00.000+00:00',
              hasChapter35Eligibility: true,
              monthlyAwardAmount: 123,
              serviceConnectedPercentage: 88,
              hasDeathResultOfDisability: false,
              hasSurvivorsIndemnityCompensationAward: true,
              hasSurvivorsPensionAward: false,
              hasAdaptedHousing: true,
              hasIndividualUnemployabilityGranted: false,
              hasNonServiceConnectedPension: true,
              hasServiceConnectedDisabilities: false,
              hasSpecialMonthlyCompensation: true,
            },
            militaryService: {
              branch: 'Army',
              characterOfService: CharacterOfServiceConstants.HONORABLE,
              enteredDate: '1990-01-01T05:00:00.000+00:00',
              releasedDate: '1993-10-01T04:00:00.000+00:00',
            },
          },
        },
      }

      dispatch(dispatchFinishGetLetterBeneficiaryData(letterBeneficiaryDataPayload.data.attributes))
    } catch (error) {
      dispatch(dispatchFinishGetLetterBeneficiaryData(undefined, error))
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
 * @param letterType - the type of letter to download
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

      const filePath = await downloadFile('POST', lettersAPI, `${letterType}.pdf`, (body as unknown) as Params)
      dispatch(dispatchFinishDownloadLetter())

      if (filePath) {
        await FileViewer.open(filePath)
      } else {
        // TODO let ui know it failed
      }
    } catch (error) {
      dispatch(dispatchFinishDownloadLetter(error))
    }
  }
}
