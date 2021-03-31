import React, { FC } from 'react'

import { Pressable, PressableProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VAButtonTextColors, VATextColors } from '../styles/theme'
import { testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant, BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'

export type FooterButtonProps = {
  /** text that will display on the button */
  text: string
  /** text color */
  textColor?: keyof VATextColors | keyof VAButtonTextColors
  /** props for icon */
  iconProps?: VAIconProps
  /** function called when pressed */
  onPress?: () => void
  /** background color */
  backGroundColor?: BackgroundVariant
  /** test id */
  testID?: string
}

const FooterButton: FC<FooterButtonProps> = ({ text, iconProps, onPress, textColor, backGroundColor, testID }) => {
  const theme = useTheme()

  const pressableProps: PressableProps = {
    onPress,
    accessibilityRole: 'button',
    accessible: true,
  }

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: backGroundColor || 'main',
    borderTopColor: 'primary',
    borderTopWidth: 'default',
    minHeight: theme.dimensions.touchableMinHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.cardPadding,
  }

  return (
    <SafeAreaView edges={['bottom']}>
      <Pressable {...pressableProps} {...testIdProps(testID || text)}>
        <Box {...boxProps}>
          <Box mr={theme.dimensions.condensedMarginBetween}>
            <VAIcon name="ArrowRight" fill="link" width={22} height={22} {...iconProps} />
          </Box>
          <TextView variant="MobileBodyBold" display="flex" flexDirection="row" color={textColor || 'link'} mr={theme.dimensions.textIconMargin}>
            {text}
          </TextView>
        </Box>
      </Pressable>
    </SafeAreaView>
  )
}

export default FooterButton
