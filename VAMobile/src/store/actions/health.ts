import { HealthData } from 'store/api'
import { ReduxAction } from 'store/types'

/**
 * Dispatch action set/update health information
 */
export const dispatchUpdateHealth = (health?: HealthData, error?: Error): ReduxAction => {
  return {
    type: 'HEALTH_UPDATE',
    payload: {
      health,
      error,
    },
  }
}

/**
 * Dispatch action to clear health data
 */
export const dispatchClearHealth = (): ReduxAction => {
  return {
    type: 'HEALTH_CLEAR',
    payload: {},
  }
}
