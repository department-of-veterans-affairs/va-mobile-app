import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import {
  BenefitSummaryAndServiceVerificationLetterOptions,
  CharacterOfServiceConstants,
  LetterBeneficiaryData,
  LetterBeneficiaryDataPayload,
  LetterTypes,
  LettersList,
} from 'store/api'
import { downloadFile } from '../../utils/filesystem'
import FileViewer from 'react-native-file-viewer'

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
      console.log('LETTERS ---')
      const letters = await api.get<api.LettersData>('/v0/letters')

      console.log(letters)
      console.log('------')
      console.log(letters?.data.attributes)
      console.log('END LETTERS ---')

      // TODO: use endpoint when available
      const lettersData: LettersList = [
        {
          name: 'Commissary Letter',
          letterType: 'commissary',
        },
        {
          name: 'Proof of Service Letter',
          letterType: 'proof_of_service',
        },
        {
          name: 'Proof of Creditable Prescription Drug Coverage Letter',
          letterType: 'medicare_partd',
        },
        {
          name: 'Proof of Minimum Essential Coverage Letter',
          letterType: 'minimum_essential_coverage',
        },
        {
          name: 'Service Verification Letter',
          letterType: 'service_verification',
        },
        {
          name: 'Civil Service Preference Letter',
          letterType: 'civil_service',
        },
        {
          name: 'Benefit Summary and Service Verification Letter',
          letterType: 'benefit_summary',
        },
        {
          name: 'Benefit Verification Letter',
          letterType: 'benefit_verification',
        },
      ]

      dispatch(dispatchFinishGetLetters(lettersData))
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
export const downloadLetter = (letterType: LetterTypes, _lettersOption?: BenefitSummaryAndServiceVerificationLetterOptions): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartDownloadLetter())

    try {
      // TODO: use endpoint when available to downloadFile
      // const downloadLetterEndPoint = `/v0/letters/{letterType}/download`
      // const body = _lettersOption
      const dummyPDFendPoint = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
      const body = {}
      const filePath = await downloadFile('GET', dummyPDFendPoint, `${letterType}.pdf`, body)

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
