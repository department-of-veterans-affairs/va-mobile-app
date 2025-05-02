import React, { FC, useState } from 'react'
import { Pressable, PressableProps, ViewStyle } from 'react-native'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { IconProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Icon/Icon'

import { a11yHintProp } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'

import Box, { BoxProps } from './Box'
import TextView from './TextView'
import { ColorVariant, TextArea } from './index'

/**
 * Signifies props passed into {@link CollapsibleView}
 */
export type CollapsibleViewProps = {
  /** text displayed on the touchable */
  text: string
  /** optional color for the touchable text */
  textColor?: ColorVariant
  /** optional param that renders the child content outside text area when set to false (defaults to true) */
  contentInTextArea?: boolean
  /** optional a11y hint */
  a11yHint?: string
  /** Whether to display any of the collapsible view in a text area. If false, contentInTextArea will have no effect. **/
  showInTextArea?: boolean
  /** Option Test ID */
  testID?: string
}

/**
 * CollapsibleView that on click reveals content, which is hidden again on another click
 *
 * @returns CollapsibleView component
 */
const CollapsibleView: FC<CollapsibleViewProps> = ({
  text,
  contentInTextArea = true,
  showInTextArea = true,
  a11yHint,
  textColor,
  children,
  testID,
}) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const boxStyles: BoxProps = {
    // flexShrink is necessary to keep textView from expanding too far and causing a gap between text contents and arrow icon
    // also keeps textView from pushing arrow beyond right margin when large text is enabled
    flexShrink: 1,
    mr: 1,
    borderBottomWidth: 2,
    borderBottomColor: 'photoAdd', // todo rename photoAdd border color to be more abstract (talk to design)
  }

  const getChevronIcon = (): React.ReactNode => {
    const iconProps: IconProps = {
      fill: theme.colors.icon.chevronCollapsible,
      name: expanded ? 'ExpandLess' : 'ExpandMore',
      width: 30,
      height: 30,
    }
    return <Icon {...iconProps} />
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityRole: 'tab',
  }

  const pressableStyles: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: theme.dimensions.touchableMinHeight,
  }

  const childrenDisplayed = expanded && <Box>{children}</Box>

  const touchableRow = (
    <Box minHeight={theme.dimensions.touchableMinHeight}>
      {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
      <Pressable
        accessibilityLabel={text}
        {...a11yHintProp(a11yHint || '')}
        style={pressableStyles}
        {...pressableProps}
        testID={testID}>
        <Box {...boxStyles}>
          <TextView color={textColor} variant={'MobileBody'}>
            {text}
          </TextView>
        </Box>
        {getChevronIcon()}
      </Pressable>
    </Box>
  )

  const a11yProps: BoxProps = {
    accessibilityRole: 'tablist',
  }

  // If none of the content is shown in a text area
  if (!showInTextArea) {
    return (
      <Box {...a11yProps}>
        {touchableRow}
        {childrenDisplayed}
      </Box>
    )
  }

  // If the pressable row and/or content is in a text area
  return (
    <Box {...a11yProps}>
      <TextArea>
        {touchableRow}
        {contentInTextArea && childrenDisplayed}
      </TextArea>
      {!contentInTextArea && childrenDisplayed}
    </Box>
  )
}

export default CollapsibleView
