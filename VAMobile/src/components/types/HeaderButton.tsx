import { AccessibilityRole } from 'react-native'

import { VAIconProps } from 'components/VAIcon'

export type HeaderButton = {
  label: string
  labelA11y?: string
  accessibilityRole?: AccessibilityRole
  icon: VAIconProps
  onPress: () => void
  testID?: string
}
