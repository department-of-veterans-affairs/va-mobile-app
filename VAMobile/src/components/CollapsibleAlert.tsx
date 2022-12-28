import { Pressable, PressableProps, View } from 'react-native'
import React, { FC, ReactNode, useEffect, useState } from 'react'

import { Box, BoxProps, VAIcon, VA_ICON_MAP } from './index'
import { TextView } from 'components'
import { VABorderColors } from 'styles/theme'
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
}

const CollapsibleAlert: FC<CollapsibleAlertProps> = ({ border, headerText, body, a11yLabel }) => {
  const theme = useTheme()
  const [expanded, setExpanded] = useState(false)
  const [focusRef, setFocus] = useAccessibilityFocus<View>()
  useEffect(() => {
    setFocus()
  }, [expanded, setFocus])

  const onPress = (): void => {
    setExpanded(!expanded)
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityState: { expanded },
    accessibilityLabel: a11yLabel,
    accessibilityRole: 'spinbutton',
  }

  const iconName: keyof typeof VA_ICON_MAP = expanded ? 'ArrowUp' : 'ArrowDown'

  const accordionHeader = () => {
    const data = (
      <Box flexDirection="row">
        <Box flex={1}>
          <TextView variant="MobileBodyBold">{headerText}</TextView>
        </Box>
        <Box mt={theme.dimensions.condensedMarginBetween} ml={10}>
          <VAIcon name={iconName} fill={theme.colors.icon.chevronCollapsible} width={16} height={10} />
        </Box>
      </Box>
    )

    return (
      <Pressable {...pressableProps} ref={focusRef}>
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
  }

  return (
    <Box {...boxProps}>
      <TextArea>
        {accordionHeader()}
        {expanded && body}
      </TextArea>
    </Box>
  )
}

export default CollapsibleAlert
