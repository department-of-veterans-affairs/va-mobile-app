import React, { FC, useState } from 'react'

import { Pressable, PressableProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { VAButtonTextColors, VATextColors } from '../styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { themeFn } from 'utils/theme'
import { useTheme } from 'utils/hooks'
import Box, { BackgroundVariant, BoxProps } from './Box'
import TextView from './TextView'
import VAIcon, { VAIconProps } from './VAIcon'
import styled from 'styled-components'

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
  /** optional accessibility hint */
  a11yHint?: string
}

const StyledSafeAreaView = styled(SafeAreaView)`
  background-color: ${themeFn((theme) => theme.colors.background.navButton)};
`

const FooterButton: FC<FooterButtonProps> = ({ text, iconProps, onPress, textColor, backGroundColor, testID, a11yHint }) => {
  const theme = useTheme()

  const [isPressed, setIsPressed] = useState(false)

  const getTextColor = (): keyof VATextColors | keyof VAButtonTextColors => {
    if (textColor) {
      return textColor
    }

    return isPressed ? 'footerButtonActive' : 'footerButton'
  }

  const pressableProps: PressableProps = {
    onPress,
    onPressIn: (): void => setIsPressed(true),
    onPressOut: (): void => setIsPressed(false),
    accessibilityRole: 'button',
    accessible: true,
  }

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: backGroundColor || isPressed ? 'footerButtonActive' : 'navButton',
    borderTopColor: 'primary',
    borderTopWidth: 'default',
    minHeight: theme.dimensions.navBarHeight,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.cardPadding,
  }

  return (
    <StyledSafeAreaView edges={['bottom']}>
      <Pressable {...pressableProps} {...testIdProps(testID || text)} {...a11yHintProp(a11yHint || '')}>
        <Box {...boxProps}>
          {iconProps && (
            <Box mr={theme.dimensions.condensedMarginBetween}>
              <VAIcon fill={isPressed ? 'footerButtonActive' : 'footerButton'} width={22} height={22} preventScaling={true} {...iconProps} />
            </Box>
          )}
          <TextView variant="MobileBodyBold" allowFontScaling={false} color={getTextColor()} mr={theme.dimensions.textIconMargin}>
            {text}
          </TextView>
        </Box>
      </Pressable>
    </StyledSafeAreaView>
  )
}

export default FooterButton
