import { LettersList } from 'store/api'
import createReducer from './createReducer'

export type LettersState = {
  loading: boolean
  error?: Error
  letters?: LettersList
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
})
