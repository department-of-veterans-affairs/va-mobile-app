import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { activateRemoteConfig } from 'utils/remoteConfig'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type SettingsState = {
  haptics: boolean
  loadingRemoteConfig: boolean
  remoteConfigActivated: boolean
}

export const initialSettingsState: SettingsState = {
  haptics: false,
  loadingRemoteConfig: false,
  remoteConfigActivated: false,
}

const STORAGE_HAPTICS_KEY = '@store_settings_haptics'

/**
 * Load the haptics setting from asyncStorage
 */
export const loadHapticsSetting = (): AppThunk => async (dispatch) => {
  const stringValue = await AsyncStorage.getItem(STORAGE_HAPTICS_KEY)
  const booleanValue = stringValue === 'true'
  dispatch(dispatchUpdateHaptics(booleanValue))
}

/**
 * Update the haptics setting in state and asyncStorage
 * @param value - boolean value to store
 */
export const updateHapticsSetting =
  (value: boolean): AppThunk =>
  async (dispatch) => {
    await AsyncStorage.setItem(STORAGE_HAPTICS_KEY, JSON.stringify(value))
    dispatch(dispatchUpdateHaptics(value))
  }

/**
 * Set remote config loading and activated states
 */
export const fetchAndActivateRemoteConfig = (): AppThunk => async (dispatch) => {
  try {
    dispatch(dispatchUpdateLoadingRemoteConfig(true))
    await activateRemoteConfig()
    dispatch(dispatchFinishLoadingRemoteConfig())
  } catch (err) {
    dispatch(dispatchUpdateLoadingRemoteConfig(false))
  }
}

/**
 * Redux slice that will create the actions and reducers
 */
const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialSettingsState,
  reducers: {
    dispatchUpdateHaptics: (state, action: PayloadAction<boolean>) => {
      state.haptics = action.payload
    },
    dispatchUpdateLoadingRemoteConfig: (state, action: PayloadAction<boolean>) => {
      state.loadingRemoteConfig = action.payload
    },
    dispatchFinishLoadingRemoteConfig: (state) => {
      state.remoteConfigActivated = true
      state.loadingRemoteConfig = false
    },
  },
})

const { dispatchUpdateHaptics, dispatchUpdateLoadingRemoteConfig, dispatchFinishLoadingRemoteConfig } = settingsSlice.actions
export default settingsSlice.reducer
