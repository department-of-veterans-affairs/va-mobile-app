import { AsyncReduxAction, ReduxAction } from '../types'

const dispatchUpdateDeviceToken = (deviceToken?: string): ReduxAction => {
  return {
    type: 'NOTIFICATION_STATE_UPDATE',
    payload: {
      deviceToken: deviceToken,
    },
  }
}

export const updateDeviceToken = (deviceToken?: string): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateDeviceToken(deviceToken))
  }
}
