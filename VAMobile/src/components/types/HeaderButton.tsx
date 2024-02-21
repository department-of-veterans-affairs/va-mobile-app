import { VAIconProps } from 'components/VAIcon'

export type HeaderButton = {
  label: string
  labelA11y?: string
  icon: VAIconProps
  onPress: () => void
  testID?: string
}
