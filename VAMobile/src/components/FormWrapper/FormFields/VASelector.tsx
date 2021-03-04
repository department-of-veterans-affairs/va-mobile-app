import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { Box, TextView, VAIcon, VAIconProps } from '../../index'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

export enum SelectorType {
  Checkbox = 'Checkbox',
  Radio = 'Radio',
}

/**
 * Signifies props for the component {@link VASelector}
 */
export type VASelectorProps = {
  /** render checkbox or radio button */
  selectorType?: SelectorType
  /** when true displays the filled checkbox/radio , when false displays the empty checkbox/radio */
  selected: boolean
  /** sets the value of selected on click of the checkbox/radio */
  onSelectionChange: (selected: boolean) => void
  /** label displayed next to the checkbox/radio */
  label: string
  /** optional boolean that disables the VASelector/radio when set to true */
  disabled?: boolean
  /** optional accessibilityLabel */
  a11yLabel?: string
  /** optional accessibilityHint */
  a11yHint?: string
}

const VASelector: FC<VASelectorProps> = ({ selectorType = SelectorType.Checkbox, selected, onSelectionChange, label, disabled, a11yLabel, a11yHint }) => {
  const theme = useTheme()

  const selectorOnPress = (): void => {
    if (!disabled) {
      onSelectionChange(!selected)
    }
  }

  const getCheckBoxIcon = (): React.ReactNode => {
    if (disabled && selectorType === SelectorType.Radio) {
      return <VAIcon name="DisabledRadio" width={22} height={22} {...testIdProps('DisabledRadio')} />
    }

    const filledName = selectorType === SelectorType.Checkbox ? 'FilledCheckBox' : 'FilledRadio'
    const emptyName = selectorType === SelectorType.Checkbox ? 'EmptyCheckBox' : 'EmptyRadio'

    const name = selected ? filledName : emptyName
    const fill = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabledContrast'
    const stroke = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabled'
    const selectorIconProps: VAIconProps = {
      name,
      width: 22,
      height: 22,
      fill,
      stroke,
    }

    return <VAIcon {...selectorIconProps} {...testIdProps(name)} />
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}

  return (
    <TouchableWithoutFeedback onPress={selectorOnPress} accessibilityState={{ checked: selected }} accessibilityRole="checkbox" {...hintProp} {...testIdProps(a11yLabel || label)}>
      <Box flexDirection="row">
        <Box {...testIdProps('checkbox-with-label')}>{getCheckBoxIcon()}</Box>
        <TextView variant="VASelector" ml={theme.dimensions.checkboxLabelMargin} mr={theme.dimensions.cardPadding} color={disabled ? 'checkboxDisabled' : 'primary'}>
          {label}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default VASelector
