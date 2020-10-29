import { TouchableWithoutFeedback } from 'react-native'
import React, { FC } from 'react'

import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

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
    const fill = selected ? 'inactive' : 'contrast'
    const stroke = selected ? 'inactive' : 'border'
    return <VAIcon name={name} fill={fill} stroke={stroke} />
  }

  return (
    <Box flexDirection="row">
      <TouchableWithoutFeedback onPress={checkBoxOnPress}>{getCheckBoxIcon()}</TouchableWithoutFeedback>
      <TextView variant="MobileBody" ml={10} mr={40}>
        {text}
      </TextView>
    </Box>
  )
}

export default CheckBox
