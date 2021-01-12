import { isIOS } from './platform'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()
interface AccessabilityProps {
  accessible?: boolean
  testID?: string
  accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean): AccessabilityProps => {
  const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

  // only set accessibility label on one platform or the other when integration tests are running to ensure the tests work
  // if tests are not running, return testID and accessibilityLabel for both platforms
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
