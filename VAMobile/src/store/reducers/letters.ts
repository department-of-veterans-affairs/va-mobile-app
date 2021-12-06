import _ from 'underscore'

import { LetterBeneficiaryData, LetterMilitaryService, LettersList } from 'store/api'
import { sortByDate } from 'utils/common'
import { getSubstringBeforeChar } from 'utils/formattingUtils'
import createReducer from './createReducer'

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

export default createReducer<LettersState>(initialLettersState, {
  LETTERS_START_GET_LETTERS_LIST: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  LETTERS_FINISH_GET_LETTERS_LIST: (state, payload) => {
    const { letters, error } = payload

    const newLetters = letters || []

    return {
      ...state,
      letters: _.sortBy(newLetters, (letter) => {
        return letter.name
      }),
      error,
      loading: false,
    }
  },
  LETTER_START_GET_BENEFICIARY_DATA: (state, payload) => {
    return {
      ...state,
      ...payload,
      loading: true,
    }
  },
  LETTER_FINISH_GET_BENEFICIARY_DATA: (state, payload) => {
    const { letterBeneficiaryData, error } = payload
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

    return {
      ...state,
      letterBeneficiaryData,
      mostRecentServices,
      error,
      loading: false,
    }
  },
  LETTER_START_DOWNLOAD_LETTER: (state, _payload) => {
    return {
      ...state,
      letterDownloadError: undefined,
      downloading: true,
    }
  },
  LETTER_FINISH_DOWNLOAD_LETTER: (state, payload) => {
    const { error } = payload

    return {
      ...state,
      letterDownloadError: error,
      downloading: false,
    }
  },
})
