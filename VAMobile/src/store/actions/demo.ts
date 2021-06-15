import * as api from 'store/api'
import { AsyncReduxAction, ReduxAction } from '../types'
import { initDemoStore } from '../api/demo/store'

export const dispatchUpdateDemoMode = (demoMode: boolean): ReduxAction => {
  console.log(`redux action: ${demoMode}`)
  return {
    type: 'UPDATE_DEMO_MODE',
    payload: { demoMode: demoMode },
  }
}

export const updateDemoMode = (demoMode: boolean): AsyncReduxAction => {
  return async (dispatch): Promise<void> => {
    console.log('set api.demoMode')
    api.setDemoMode(demoMode)
    console.log('dispatchUpdateDemoMode')
    dispatch(dispatchUpdateDemoMode(demoMode))
    await initDemoStore()
  }
}
