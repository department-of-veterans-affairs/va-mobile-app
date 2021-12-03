import { NativeModules, PixelRatio } from 'react-native'

import { AsyncReduxAction, ReduxAction } from '../types'
import { UserAnalytics } from 'constants/analytics'
import { setAnalyticsUserProperty } from 'utils/analytics'

const { RNCheckVoiceOver } = NativeModules

const dispatchUpdateFontScale = (fontScale: number): ReduxAction => {
  return {
    type: 'FONT_SCALE_UPDATE',
    payload: {
      fontScale,
    },
  }
}

/**
 * Redux action to update the font scale
 */
export const updateCurrentFontScale = (fontScale: number): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateFontScale(fontScale))
  }
}

const dispatchUpdateIsVoiceOverTalkBackRunning = (isVoiceOverTalkBackRunning: boolean): ReduxAction => {
  return {
    type: 'IS_VOICE_OVER_TALK_BACK_RUNNING_UPDATE',
    payload: {
      isVoiceOverTalkBackRunning,
    },
  }
}

/**
 * Redux action to update the variable signifying if voice over or talk back are currently running
 */
export const updateCurrentIsVoiceOverTalkBackRunning = (isVoiceOverTalkBackRunning: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateIsVoiceOverTalkBackRunning(isVoiceOverTalkBackRunning))
  }
}

const dispatchUpdateAccessibilityFocus = (isFocus: boolean): ReduxAction => {
  return {
    type: 'UPDATE_ACCESSIBILITY_FOCUS',
    payload: {
      isFocus,
    },
  }
}

/**
 * Redux action to update the variable when accessibility focus has been set
 */
export const updateAccessibilityFocus = (isFocus: boolean): AsyncReduxAction => {
  return async (dispatch, _getState): Promise<void> => {
    dispatch(dispatchUpdateAccessibilityFocus(isFocus))
  }
}

/**
 * Redux action to send to analytics if the users is using large text
 */
export const sendUsesLargeTextAnalytics = (): AsyncReduxAction => {
  return async (): Promise<void> => {
    const islargeText = PixelRatio.getFontScale() > 1
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_biometric(islargeText))
  }
}

/**
 * Redux action to send to analytics if the users is using screen reader
 */
export const sendUsesScreenReaderAnalytics = (): AsyncReduxAction => {
  return async (): Promise<void> => {
    const isRunning = await RNCheckVoiceOver.isVoiceOverRunning()
    await setAnalyticsUserProperty(UserAnalytics.vama_uses_screen_reader(isRunning))
  }
}
