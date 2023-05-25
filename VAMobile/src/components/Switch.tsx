import { AccessibilityProps, Switch as RNSwitch } from 'react-native'
import React, { FC } from 'react'

import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import styled from 'styled-components'

const StyledRNSwitch = styled(RNSwitch)`
  shadow-opacity: 0.3;
  shadow-radius: 1px;
  shadow-offset: 0px 0.5px;
  min-width: 51px;
`
/**
 * Signifies props passed into {@link Switch}
 */
export type SwitchProps = AccessibilityProps & {
  /** callback called on value change of the switch */
  onPress: (value: boolean) => void
  /** optional value of switch, updated with onPress */
  on?: boolean
  /** optional testID of switch */
  testID?: string
  /** optional accessibilityHint */
  a11yHint?: string
}

/**A common component for the react native switch component*/
const Switch: FC<SwitchProps> = (props) => {
  const { onPress, on, testID, a11yHint } = props
  const theme = useTheme()
  return (
    <StyledRNSwitch
      trackColor={{ false: theme.colors.control.switchOffTrack, true: theme.colors.control.switchOnTrack }}
      thumbColor={theme.colors.control.switchOnThumb}
      onValueChange={onPress}
      value={!!on}
      testID={testID}
      {...a11yHintProp(a11yHint || '')}
    />
  )
}

export default Switch
