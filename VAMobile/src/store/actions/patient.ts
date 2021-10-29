import { CernerData } from 'store/api'
import { ReduxAction } from 'store/types'

/**
 * Dispatch action set/update cerner information
 */
export const dispatchUpdateCerner = (cerner?: CernerData, error?: Error): ReduxAction => {
  return {
    type: 'CERNER_UPDATE',
    payload: {
      cerner,
      error,
    },
  }
}

/**
 * Dispatch action to clear cerner data
 */
export const dispatchClearCerner = (): ReduxAction => {
  return {
    type: 'CERNER_CLEAR',
    payload: {},
  }
}
