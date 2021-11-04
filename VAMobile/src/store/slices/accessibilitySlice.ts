import { AppThunk } from 'store'
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { PixelRatio } from 'react-native'

export type AccessibilityState = {
  fontScale: number
  isVoiceOverTalkBackRunning: boolean
  isFocus: boolean
}

export const initialAccessibilityState = {
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
 * Redux slice that will create the actions and reducers
 */
const accessibilitySlice = createSlice({
  name: 'accessibility',
  initialState: initialAccessibilityState,
  reducers: {
    // The disptach font scale reducer
    dispatchUpdateFontScale: (state, action: PayloadAction<number>) => {
      state.fontScale = action.payload
    },

    // The disptach update is voice over reducer
    dispatchUpdateIsVoiceOverTalkBackRunning: (state, action: PayloadAction<boolean>) => {
      state.isVoiceOverTalkBackRunning = action.payload
    },

    // The disptach update is focus reducer
    dispatchUpdateAccessibilityFocus: (state, action: PayloadAction<boolean>) => {
      state.isFocus = action.payload
    },
  },
})

// Actions method created by the slice
export const { dispatchUpdateFontScale, dispatchUpdateIsVoiceOverTalkBackRunning, dispatchUpdateAccessibilityFocus } = accessibilitySlice.actions

export default accessibilitySlice.reducer
