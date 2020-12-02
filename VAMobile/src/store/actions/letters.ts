import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { CharacterOfServiceConstants, LetterBeneficiaryData, LetterBeneficiaryDataPayload, LetterTypes, LettersList } from 'store/api'

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
export const downloadLetter = (_letterType: LetterTypes): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchStartDownloadLetter())

    try {
      // TODO: use endpoint when available
      // TODO parameters for post require data from letterBeneficiaryData to be passed along as part of the request
      // const letterBeneficiaryData = await api.post<api.LetterBeneficiaryDataPayload>(`/v0/letters/{letterType}/download`)
      // TODO: download file

      // todo mock downloading
      setTimeout(() => {
        dispatch(dispatchFinishDownloadLetter())
      }, 2000)
    } catch (error) {
      dispatch(dispatchFinishDownloadLetter(error))
    }
  }
}
