import { PixelRatio } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'

import { AuthState, StoreState } from 'store/reducers'
import { isIOS } from './platform'
import { updateCurrentFontScale } from 'store/actions'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()
interface AccessabilityProps {
  accessible?: boolean
  testID?: string
  accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean): AccessabilityProps => {
  const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

  // setting both testID and  accessibilityLabel prevents elements from being found in the integration tests on iOS
  // testID is not used on android for the integration tests
  if (IS_TEST) {
    if (isIOS()) {
      return { ...disableAccessibility, testID: id }
    }

    return { ...disableAccessibility, accessibilityLabel: id }
  }

  return { ...disableAccessibility, testID: id, accessibilityLabel: id }
}

export const a11yHintProp = (hint: string): { accessibilityHint?: string } => {
  // Remove a11yHints from tests as it can cause querying issues for android integration tests
  return IS_TEST ? {} : { accessibilityHint: hint }
}

export const updateFontScale = (newState: string) => {
  const dispatch = useDispatch()
  const { fs } = useSelector<StoreState, AuthState>((state) => state.auth)

  if (newState === 'active') {
    const fsUpdated = PixelRatio.getFontScale()
    if (fs !== fsUpdated) {
      dispatch(updateCurrentFontScale(fsUpdated))
    }
  }
}
