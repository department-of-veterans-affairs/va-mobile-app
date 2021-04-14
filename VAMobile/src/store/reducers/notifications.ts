import createReducer from './createReducer'

export type NotificationPreferences = {
  [keyof: string]: boolean
}

export type NotificationsState = {
  deviceToken?: string
  registeringDevice: boolean
  preferences: NotificationPreferences
  loadingPreferences: boolean
  settingPreference: boolean
}

export const initialNotificationsState = {
  deviceToken: undefined,
  registeringDevice: false,
  preferences: {},
  loadingPreferences: false,
  settingPreference: false,
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

  NOTIFICATIONS_START_GET_PREFS: (state) => {
    return {
      ...state,
      loadingPreferences: true,
    }
  },

  NOTIFICATIONS_END_GET_PREFS: (state, { preferences }) => {
    return {
      ...state,
      preferences: preferences || {},
      loadingPreferences: false,
    }
  },

  NOTIFICATIONS_START_SET_PREFS: (state) => {
    return {
      ...state,
      settingPreference: true,
    }
  },

  NOTIFICATIONS_END_SET_PREFS: (state, pref) => {
    const preferences = pref ? Object.assign(state.preferences, { [pref.preference]: pref.enabled }) : state.preferences
    return {
      ...state,
      preferences,
      settingPreference: false,
    }
  },
})
