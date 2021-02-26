import createReducer from './createReducer'

export type NotificationsState = {
  deviceToken?: string
}

export const initialNotificationsState = {
  deviceToken: undefined,
}

export default createReducer<NotificationsState>(initialNotificationsState, {
  NOTIFICATION_STATE_UPDATE: (state, { deviceToken }) => {
    return {
      ...state,
      deviceToken: deviceToken,
    }
  },
})
