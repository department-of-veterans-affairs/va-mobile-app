import { AppStateStatus, PixelRatio } from 'react-native'

import { ThunkDispatch } from 'redux-thunk'

import { Action } from 'redux'
import { StoreState } from 'store/reducers'
import { isIOS } from './platform'
import { updateCurrentFontScale } from 'store/actions'
import getEnv from 'utils/env'

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
    if (isIOS()) {
      return { ...disableAccessibility, testID: idToUse }
    }

    return { ...disableAccessibility, accessibilityLabel: idToUse }
  }

  return { ...disableAccessibility, testID: idToUse, accessibilityLabel: idToUse }
}

export const a11yHintProp = (hint: string): { accessibilityHint?: string } => {
  // Remove a11yHints from tests as it can cause querying issues for android integration tests
  return IS_TEST ? {} : { accessibilityHint: hint }
}

/**
 * Updates the font scale of the app if the user switched from one app to VA Mobile and the font scale has changed
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
