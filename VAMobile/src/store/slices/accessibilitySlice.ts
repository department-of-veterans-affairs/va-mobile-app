import { NativeModules, PixelRatio } from 'react-native'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

import { AppThunk } from 'store'
import { UserAnalytics } from 'constants/analytics'
import { setAnalyticsUserProperty } from 'utils/analytics'
const { RNCheckVoiceOver } = NativeModules

export type AccessibilityState = {
  fontScale: number
  isVoiceOverTalkBackRunning: boolean
  isFocus: boolean
}

export const initialAccessibilityState: AccessibilityState = {
  fontScale: PixelRatio.getFontScale(),
  isVoiceOverTalkBackRunning: false,
  isFocus: true,
}

/**
 * Redux action to update the font scale
 */

export const updateCurrentFontScale =
  (fontScale: number): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateFontScale(fontScale))
  }

/**
 * Redux action to update the variable signifying if voice over or talk back are currently running
 */
export const updateCurrentIsVoiceOverTalkBackRunning =
  (isVoiceOverTalkBackRunning: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateIsVoiceOverTalkBackRunning(isVoiceOverTalkBackRunning))
  }

/**
 * Redux action to update the variable when accessibility focus has been set
 */
export const updateAccessibilityFocus =
  (isFocus: boolean): AppThunk =>
  async (dispatch) => {
    dispatch(dispatchUpdateAccessibilityFocus(isFocus))
  }

/**
 * Redux action to send to analytics if the users is using large text
 */
export const sendUsesLargeTextAnalytics = (): AppThunk => async () => {
  const islargeText = PixelRatio.getFontScale() > 1
  await setAnalyticsUserProperty(UserAnalytics.vama_uses_large_text(islargeText))
}

/**
 * Redux action to send to analytics if the users is using screen reader
 */
export const sendUsesScreenReaderAnalytics = (): AppThunk => async () => {
  const isRunning = await RNCheckVoiceOver.isVoiceOverRunning()
  await setAnalyticsUserProperty(UserAnalytics.vama_uses_screen_reader(isRunning))
}

/**
 * Redux slice that will create the actions and reducers
 */
const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState: initialAccessibilityState,
  reducers: {
    dispatchUpdateFontScale: (state, action: PayloadAction<number>) => {
      state.fontScale = action.payload
    },

    dispatchUpdateIsVoiceOverTalkBackRunning: (state, action: PayloadAction<boolean>) => {
      state.isVoiceOverTalkBackRunning = action.payload
    },

    dispatchUpdateAccessibilityFocus: (state, action: PayloadAction<boolean>) => {
      state.isFocus = action.payload
    },
  },
})

// Actions creators created by the slice
export const { dispatchUpdateFontScale, dispatchUpdateIsVoiceOverTalkBackRunning, dispatchUpdateAccessibilityFocus } = accessibilitySlice.actions

export default accessibilitySlice.reducer
