import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import { testIdProps } from 'utils/accessibility'
import Box from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type CheckBoxProps = {
  selected: boolean
  setSelected: (selected: boolean) => void
  text: string
}

const CheckBox: FC<CheckBoxProps> = ({ selected, setSelected, text }) => {
  const checkBoxOnPress = (): void => {
    setSelected(!selected)
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

    return <VAIcon {...checkBoxIconProps} />
  }

  return (
    <TouchableWithoutFeedback onPress={checkBoxOnPress} accessibilityState={{ checked: selected }}>
      <Box flexDirection="row">
        <Box {...testIdProps('checkbox-with-text')}>{getCheckBoxIcon()}</Box>
        <TextView variant="MobileBody" ml={10} mr={40}>
          {text}
        </TextView>
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CheckBox
