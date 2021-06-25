import React, { FC, useState } from 'react'

import { Pressable, PressableProps, Text, View, ViewStyle, useWindowDimensions } from 'react-native'
import { TextArea, TextViewProps } from './index'
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
  /** optional param that renders the child content outside text area when set to false (defaults to true) */
  contentInTextArea?: boolean
  /** optional a11y hint */
  a11yHint?: string
  /** Whether to display any of the collapsible view in a text area. If false, contentInTextArea will have no effect. **/
  showInTextArea?: boolean
}

/**
 * CollapsibleView that on click reveals content, which is hidden again on another click
 *
 * @returns CollapsibleView component
 */
const CollapsibleView: FC<CollapsibleViewProps> = ({ text, contentInTextArea = true, showInTextArea = true, a11yHint, children }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const boxStyles: BoxProps = {
    // flexShrink is necessary to keep textView from expanding too far and causing a gap between text contents and arrow icon
    // also keeps textView from pushing arrow beyond right margin when large text is enabled
    flexShrink: 1,
    mr: theme.dimensions.collapsibleIconMargin,
    borderBottomWidth: 2,
    borderBottomColor: 'secondary',
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

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityRole: 'spinbutton',
  }

  const pressableStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const childrenDisplayed = expanded && <Box>{children}</Box>

  const touchableRow = (
    <Box minHeight={theme.dimensions.touchableMinHeight}>
      <Pressable {...testIdProps(generateTestID(text, ''))} {...a11yHintProp(a11yHint || '')} style={pressableStyles} {...pressableProps}>
        <Box {...boxStyles}>
          <TextView variant={'MobileBody'}>{text}</TextView>
        </Box>
        {getArrowIcon()}
      </Pressable>
    </Box>
  )

  // If none of the content is shown in a text area
  if (!showInTextArea) {
    return (
      <Box>
        {touchableRow}
        {childrenDisplayed}
      </Box>
    )
  }

  // If the pressable row and/or content is in a text area
  return (
    <Box>
      <TextArea>
        {touchableRow}
        {contentInTextArea && childrenDisplayed}
      </TextArea>
      {!contentInTextArea && childrenDisplayed}
    </Box>
  )
}

export default CollapsibleView
