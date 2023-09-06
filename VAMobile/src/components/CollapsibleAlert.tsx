import { Pressable, PressableProps, View } from 'react-native'
import React, { FC, ReactNode, useState } from 'react'

import { Box, BoxProps, VAIcon, VA_ICON_MAP } from './index'
import { TextView } from 'components'
import { VABorderColors } from 'styles/theme'
import { isAndroid } from 'utils/platform'
import { useAccessibilityFocus, useTheme } from 'utils/hooks'
import TextArea from './TextArea'

export type CollapsibleAlertProps = {
  /** color of the border */
  border: keyof VABorderColors
  /** accordion Header text */
  headerText: string
  /** accordion Body text */
  body: ReactNode
  /** acccessibilityLabel needs to be provided due to accessibilityState being neccessary */
  a11yLabel: string
  /** handles anything needed when expanding the alert*/
  onExpand?: () => void
  /** handles anything needed when collapsing the alert*/
  onCollapse?: () => void
  /** Optional TestID */
  testID?: string
}

const CollapsibleAlert: FC<CollapsibleAlertProps> = ({ border, headerText, body, a11yLabel, onExpand, onCollapse, testID }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [focusRef, setFocus] = useAccessibilityFocus<View>()

  const onPress = (): void => {
    if (expanded && onCollapse) {
      onCollapse()
    } else if (!expanded && onExpand) {
      onExpand()
    }
    setExpanded(!expanded)

    // TODO: This is a temporary workaround for a react-native bug that prevents 'expanded' state
    // changes from being announced in TalkBack: https://github.com/facebook/react-native/issues/30841
    // This can be removed once the fix makes it into a release and we upgrade react-native
    if (isAndroid()) {
      setFocus()
    }
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityLabel: a11yLabel,
    accessibilityRole: 'tab',
  }

  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ChevronUp' : 'ChevronDown'

  const accordionHeader = () => {
    const data = (
      <Box flexDirection="row">
        <Box flex={1}>
          <TextView variant="MobileBodyBold">{headerText}</TextView>
        </Box>
        <Box justifyContent={'center'} ml={10}>
          <VAIcon name={iconName} fill={theme.colors.icon.chevronCollapsible} width={16} height={10} />
        </Box>
      </Box>
    )

    return (
      <Pressable {...pressableProps} ref={focusRef} accessible={true}>
        {data}
      </Pressable>
    )
  }

  const leftBorderProps = {
    borderLeftWidth: theme.dimensions.alertBorderWidth,
    borderLeftColor: border,
  }

  const boxProps: BoxProps = {
    ...leftBorderProps,
    borderBottomColor: 'primary',
    borderBottomWidth: theme.dimensions.borderWidth,
    accessibilityRole: 'tablist',
  }

  return (
    <Box testID={testID} {...boxProps}>
      <TextArea>
        {accordionHeader()}
        {expanded && body}
      </TextArea>
    </Box>
  )
}

export default CollapsibleAlert
