import { AccessibilityRole } from 'react-native'

import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

export type HeaderButton = {
  label: string
  labelA11y?: string
  accessibilityRole?: AccessibilityRole
  icon: IconProps
  onPress: () => void
  testID?: string
}
