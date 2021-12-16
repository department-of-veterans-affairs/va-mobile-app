import { AccessibilityValue, AppStateStatus, NativeModules, PixelRatio } from 'react-native'

import { ThunkDispatch } from 'redux-thunk'
import _ from 'underscore'

import { Action } from 'redux'
import { StoreState } from 'store/reducers'
import { TextLine } from 'components/types'
import { isIOS } from './platform'
import { updateCurrentFontScale, updateCurrentIsVoiceOverTalkBackRunning } from 'store/actions'
import getEnv from 'utils/env'

const { RNCheckVoiceOver } = NativeModules

const { IS_TEST } = getEnv()

interface AccessabilityProps {
  accessible?: boolean
  testID?: string
  accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean, integrationTestOnlyTestId?: string): AccessabilityProps => {
  const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

  const idToUse = IS_TEST && integrationTestOnlyTestId ? integrationTestOnlyTestId : id

  // setting both testID and  accessibilityLabel prevents elements from being found in the integration tests on iOS
  // testID is not used on android for the integration tests
  if (IS_TEST) {
    return { ...disableAccessibility, testID: idToUse }
  }

  return { ...disableAccessibility, testID: idToUse, accessibilityLabel: idToUse }
}

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
export const updateFontScale = (newState: AppStateStatus, fontScale: number, dispatch: ThunkDispatch<StoreState, undefined, Action<unknown>>): void => {
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
  dispatch: ThunkDispatch<StoreState, undefined, Action<unknown>>,
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
