import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from 'store/types'
import { LettersData } from 'store/api'

export const getLetters = (): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    try {
      // const letters = await api.get<api.LettersData>('/v0/letters')
      // TODO: use endpoint when available
      const lettersData: LettersData = [
        {
          name: 'Commissary Letter',
          letterType: 'commissary',
        },
        {
          name: 'Service Verification Letter',
          letterType: 'serviceVerification',
        },
      ]
    } catch (error) {
      // return error
    }
  }
}
