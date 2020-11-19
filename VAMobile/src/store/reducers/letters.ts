import { LetterBeneficiaryData, LettersList } from 'store/api'
import createReducer from './createReducer'

export type LettersState = {
  loading: boolean
  error?: Error
  letters?: LettersList
  letterBeneficiaryData?: LetterBeneficiaryData
}

export const initialLettersState: LettersState = {
  loading: false,
  letters: [] as LettersList,
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
      letters: newLetters,
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

    return {
      ...state,
      letterBeneficiaryData,
      error,
      loading: false,
    }
  },
})
