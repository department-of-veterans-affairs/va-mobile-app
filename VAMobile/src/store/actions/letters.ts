import { AsyncReduxAction, ReduxAction } from 'store/types'
import { LettersList } from 'store/api'

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
      // const letters = await api.get<api.LettersData>('/v0/letters')
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
          name: 'Benefit Summary Letter',
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
