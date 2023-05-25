import { Pressable, PressableProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'

import { NAMESPACE } from 'constants/namespaces'

import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

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
  const { t } = useTranslation(NAMESPACE.COMMON)
  const [buttonPressed, setButtonPressed] = useState(false)

  const onPressIn = (): void => {
    setButtonPressed(true)
  }
  const onPressOut = (): void => {
    setButtonPressed(false)
  }

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessibilityHint: a11yHint || '',
    onPressIn,
    onPressOut,
  }

  const boxProps: BoxProps = {
    width: '100%',
    backgroundColor: 'textBox',
    borderWidth: theme.dimensions.buttonBorderWidth,
    borderRadius: 5,
    borderColor: buttonPressed ? 'trackingCardActive' : 'trackingCard',
  }

  const titleBoxProps: BoxProps = {
    p: 16,
    borderBottomWidth: theme.dimensions.borderWidth,
    borderBottomColor: 'primary',
    flexDirection: 'row',
  }

  const rightIconProps: VAIconProps = {
    name: 'InfoIcon',
    fill: 'infoIcon',
    height: 16,
    width: 16,
  }

  return (
    <Pressable {...pressableProps}>
      <Box {...boxProps}>
        <Box {...titleBoxProps}>
          <TextView variant="MobileBodyBold" flex={1}>
            {title}
          </TextView>
          <Box mt={7}>
            <VAIcon {...rightIconProps} />
          </Box>
        </Box>
        <Box py={8} px={16}>
          <TextView variant="HelperText">
            <TextView variant="HelperTextBold">{t('dateShipped')}: </TextView>
            {dateShipped}
          </TextView>
        </Box>
      </Box>
    </Pressable>
  )
}

export default TrackingCard
