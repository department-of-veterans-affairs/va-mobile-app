import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { initDemoStore } from '../api/demo/store'

export const dispatchUpdateDemoMode = (demoMode: boolean): ReduxAction => {
  return {
    type: 'UPDATE_DEMO_MODE',
    payload: { demoMode: demoMode },
  }
}

/**
 * sets the demo mode on or off
 * @param demoMode- boolean to set as state.demo.demoMode
 */
export const updateDemoMode = (demoMode: boolean): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    api.setDemoMode(demoMode)
    dispatch(dispatchUpdateDemoMode(demoMode))
    await initDemoStore()
  }
}
