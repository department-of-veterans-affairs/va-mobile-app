import { AccessibilityValue, AppStateStatus, NativeModules, PixelRatio } from 'react-native'

import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import _ from 'underscore'

import { TextLine } from 'components/types'
import { RootState } from 'store'
import { updateCurrentFontScale, updateCurrentIsVoiceOverTalkBackRunning } from 'store/slices/accessibilitySlice'
import getEnv from 'utils/env'

const { RNCheckVoiceOver } = NativeModules

const { IS_TEST } = getEnv()

export const a11yHintProp = (hint: string): { accessibilityHint?: string } => {
  // Remove a11yHints from tests as it can cause querying issues for android integration tests
  return IS_TEST ? {} : { accessibilityHint: hint }
}

export const a11yValueProp = (a11yValue: AccessibilityValue): { accessibilityValue?: AccessibilityValue } => {
  // Remove accessibilityValue from tests as it can cause querying issues for android integration tests
  return IS_TEST ? {} : { accessibilityValue: a11yValue }
}

/**
 * Updates the font scale of the app if the user switched from one app to VA: Health and Benefits and the font scale has changed
 *
 * @param newState - string indicating the state of the app
 * @param fontScale - current font scale value
 * @param dispatch - used to call updateCurrentFontScale action
 */
export const updateFontScale = (
  newState: AppStateStatus,
  fontScale: number,
  dispatch: ThunkDispatch<RootState, undefined, Action<string>>,
): void => {
  if (newState === 'active') {
    const fontScaleUpdated = PixelRatio.getFontScale()
    if (fontScale !== fontScaleUpdated) {
      dispatch(updateCurrentFontScale(fontScaleUpdated))
    }
  }
}

/**
 * Updates the variable isVoiceOverTalkBackRunning to true if voice over or talk back is currently running,
 * otherwise false
 *
 * @param newState - string indicating the state of the app
 * @param isVoiceOverTalkBackRunning - current value indicating if voice over or talk back is on
 * @param dispatch - used to call updateCurrentIsVoiceOverTalkBackRunning action
 */
export const updateIsVoiceOverTalkBackRunning = async (
  newState: AppStateStatus,
  isVoiceOverTalkBackRunning: boolean | undefined,
  dispatch: ThunkDispatch<RootState, undefined, Action<string>>,
): Promise<void> => {
  if (newState === 'active') {
    const isRunning = await RNCheckVoiceOver.isVoiceOverRunning()
    if (isVoiceOverTalkBackRunning !== isRunning) {
      dispatch(updateCurrentIsVoiceOverTalkBackRunning(isRunning))
    }
  }
}

/**
 * Returns testID given a ListItems textLines
 */
export const getTestIDFromTextLines = (textLines: Array<TextLine>): string => {
  return _.map(textLines, 'text').join(' ')
}
