import { PushPreference } from '../api'
import createReducer from './createReducer'

export type NotificationsState = {
  deviceToken?: string
  registeringDevice: boolean
  preferences: PushPreference[]
  loadingPreferences: boolean
  settingPreference: boolean
}

export const initialNotificationsState = {
  deviceToken: undefined,
  registeringDevice: false,
  preferences: [],
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
      preferences: preferences || [],
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
    const preferences = pref ? Object.assign(state.preferences, { [pref.preferenceId]: pref.value }) : state.preferences
    return {
      ...state,
      preferences,
      settingPreference: false,
    }
  },
})
