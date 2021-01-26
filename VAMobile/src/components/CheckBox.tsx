import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

/**
 * Signifies props for the component {@link CheckBox}
 */
export type CheckBoxProps = {
  /** when true displays the filled checkbox, when false displays the empty checkbox */
  selected: boolean
  /** sets the value of selected on click of the checkbox */
  onSelectionChange: (selected: boolean) => void
  /** label displayed next to the checkbox */
  label: string
  /** optional boolean that disables the CheckBox when set to true */
  disabled?: boolean
  /** optional accessibilityLabel */
  a11yLabel?: string
  /** optional accessibilityHint */
  a11yHint?: string
}

const CheckBox: FC<CheckBoxProps> = ({ selected, onSelectionChange, label, disabled, a11yLabel, a11yHint }) => {
  const theme = useTheme()

  const checkBoxOnPress = (): void => {
    if (!disabled) {
      onSelectionChange(!selected)
    }
  }

  const getCheckBoxIcon = (): React.ReactNode => {
    const name = selected ? 'FilledCheckBox' : 'EmptyCheckBox'
    const fill = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabledContrast'
    const stroke = selected ? 'checkboxEnabledPrimary' : 'checkboxDisabled'

    const checkBoxIconProps: VAIconProps = {
      name,
      fill,
      stroke,
      width: 22,
      height: 22,
    }

    return <VAIcon {...checkBoxIconProps} {...testIdProps(name)} />
  }

  const hintProp = a11yHint ? a11yHintProp(a11yHint) : {}

  return (
    <TouchableWithoutFeedback onPress={checkBoxOnPress} accessibilityState={{ checked: selected }} accessibilityRole="checkbox" {...hintProp} {...testIdProps(a11yLabel || label)}>
      <Box flexDirection="row">
        <Box {...testIdProps('checkbox-with-label')}>{getCheckBoxIcon()}</Box>
        <TextView variant="MobileBody" ml={theme.dimensions.checkboxLabelMargin} mr={theme.dimensions.cardPadding} color={disabled ? 'checkboxDisabled' : 'primary'}>
          {label}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CheckBox
