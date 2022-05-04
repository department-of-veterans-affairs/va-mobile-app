import { Pressable, PressableProps } from 'react-native'
import { a11yHintProp } from '../utils/accessibility'
import { useTheme, useTranslation } from '../utils/hooks'
import Box, { BoxProps } from './Box'
import React, { FC } from 'react'
import TextView from './TextView'

export type TrackingCardProps = {
  /** function to call on press */
  onPress: () => void
  /** string for accessibility hint */
  a11yHint?: string
  /** optional bolded title text */
  title: string
  /** date string */
  dateShipped: string
}

/**
 * A common component to show tracking information as a card
 */
const TrackingCard: FC<TrackingCardProps> = ({ onPress, a11yHint, title, dateShipped }) => {
  const theme = useTheme()
  const t = useTranslation()
  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    ...a11yHintProp(a11yHint || ''),
  }

  const boxProps: BoxProps = {
    width: '100%',
    backgroundColor: 'textBox',
    borderWidth: theme.dimensions.buttonBorderWidth,
    borderRadius: 5,
    borderColor: 'trackingCard',
  }

  const titleBoxProps: BoxProps = {
    p: 16,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderBottomColor: 'primary',
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <Box {...titleBoxProps}>
          <TextView variant="MobileBodyBold">{title}</TextView>
        </Box>
        <Box py={8} px={16}>
          <TextView variant="HelperText">
            <TextView variant="HelperTextBold">{t('common:dateShipped')}: </TextView>
            {dateShipped}
          </TextView>
        </Box>
      </Box>
    </Pressable>
  )
}

export default TrackingCard
