import React, { FC, useState } from 'react'

import { TextArea } from './index'
import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { generateTestID } from 'utils/common'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

/**
 * Signifies props passed into {@link CollapsibleView}
 */
export type CollapsibleViewProps = {
  /** text displayed on the touchable */
  text: string
  /** optional param that renders content outside text area when set to false (defaults to true) */
  inTextArea?: boolean
  /** optional a11y hint */
  a11yHint?: string
}

/**
 * CollapsibleView that on click reveals content, which is hidden again on another click
 *
 * @returns CollapsibleView component
 */
const CollapsibleView: FC<CollapsibleViewProps> = ({ text, inTextArea = true, a11yHint, children }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const textWrapper: BoxProps = {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    borderBottomWidth: theme.dimensions.borderWidth,
    borderBottomColor: 'secondary',
    alignSelf: 'flex-start',
  }

  const getArrowIcon = (): React.ReactNode => {
    const iconProps: VAIconProps = {
      fill: 'expandCollapse',
      name: expanded ? 'ArrowUp' : 'ArrowDown',
      width: 9,
      height: 7,
    }
    return <VAIcon {...iconProps} />
  }

  const touchableProps: TouchableWithoutFeedbackProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityRole: 'spinbutton',
  }

  const childrenDisplayed = expanded && <Box>{children}</Box>

  return (
    <Box>
      <TextArea>
        <TouchableWithoutFeedback {...testIdProps(generateTestID(text, ''))} {...a11yHintProp(a11yHint || '')} {...touchableProps}>
          <Box minHeight={theme.dimensions.touchableMinHeight}>
            <Box {...textWrapper}>
              <TextView variant={'MobileBody'} mr={theme.dimensions.textIconMargin}>
                {text}
              </TextView>
              {getArrowIcon()}
              <Box />
            </Box>
          </Box>
        </TouchableWithoutFeedback>
        {inTextArea && childrenDisplayed}
      </TextArea>
      {!inTextArea && childrenDisplayed}
    </Box>
  )
}

export default CollapsibleView
