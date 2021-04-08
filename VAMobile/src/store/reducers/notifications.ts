import createReducer from './createReducer'

export type NotificationsState = {
  deviceToken?: string
  registeringDevice: boolean
}

export const initialNotificationsState = {
  deviceToken: undefined,
  registeringDevice: false,
}

export default createReducer<NotificationsState>(initialNotificationsState, {
  NOTIFICATIONS_START_REGISTER_DEVICE: (state, payload) => {
    return {
      ...state,
      ...payload,
      registeringDevice: true,
    }
  },

  NOTIFICATIONS_END_REGISTER_DEVICE: (state, { deviceToken }) => {
    return {
      ...state,
      deviceToken: deviceToken,
      registeringDevice: false,
    }
  },
})
