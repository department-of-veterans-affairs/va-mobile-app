import { AccessibilityProps, Switch as RNSwitch } from 'react-native'
import React, { FC } from 'react'

import { useTheme } from 'utils/hooks'
import styled from 'styled-components/native'

export type SwitchProps = AccessibilityProps & {
  onPress: (value: boolean) => void
  on?: boolean
}

const StyledRNSwitch = styled(RNSwitch)`
  shadow-opacity: 0.3;
  shadow-radius: 1px;
  shadow-offset: 0px 0.5px;
  min-width: 51px;
`

const Switch: FC<SwitchProps> = (props) => {
  const { onPress, on } = props
  const theme = useTheme()
  return (
    <StyledRNSwitch
      trackColor={{ false: theme.colors.control.switchOffTrack, true: theme.colors.control.switchOnTrack }}
      thumbColor={theme.colors.control.switchOnThumb}
      onValueChange={onPress}
      value={!!on}
    />
  )
}

export default Switch
