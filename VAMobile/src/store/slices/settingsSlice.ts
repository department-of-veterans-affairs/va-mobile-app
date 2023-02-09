import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { UserAnalytics } from 'constants/analytics'
import { setAnalyticsUserProperty } from 'utils/analytics'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type SettingsState = {
  haptics: boolean
}

export const initialSettingsState: SettingsState = {
  haptics: false,
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
    value ? await setAnalyticsUserProperty(UserAnalytics.vama_haptic_setting_user_on()) : await setAnalyticsUserProperty(UserAnalytics.vama_haptic_setting_user_off())
    await AsyncStorage.setItem(STORAGE_HAPTICS_KEY, JSON.stringify(value))
    dispatch(dispatchUpdateHaptics(value))
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
  },
})

const { dispatchUpdateHaptics } = settingsSlice.actions
export default settingsSlice.reducer
