import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { NAMESPACE } from 'constants/namespaces'
import { VAIconColors, VATextColors } from 'styles/theme'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

export type CtaButtonProps = {
  /** Optional param to set icon color */
  iconColor?: keyof VAIconColors | keyof VATextColors | string
  /** Function to run on press */
  onPress?: () => void
} & BoxProps

/**
 * CtaButton that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CtaButton component
 */
const CtaButton: FC<CtaButtonProps> = ({ onPress, iconColor, backgroundColor, children, px, py, alignItems, justifyContent, accessibilityLabel, accessibilityHint }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  const touchableProps: TouchableWithoutFeedbackProps = {
    accessibilityRole: 'button',
    accessible: true,
  }

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: justifyContent || 'center',
    alignItems: alignItems || 'center',
    width: '100%',
    backgroundColor: backgroundColor || 'ctaButton',
    minHeight: theme.dimensions.touchableMinHeight,
    mb: theme.dimensions.standardMarginBetween,
    py: py ?? theme.dimensions.buttonPadding,
    px: px ?? theme.dimensions.cardPadding,
  }

  return (
    <TouchableWithoutFeedback
      onPress={onPress}
      {...touchableProps}
      {...testIdProps(accessibilityLabel || t('component.crisisLine.label'))}
      {...a11yHintProp(accessibilityHint || t('component.crisisLine.hint'))}>
      <Box {...boxProps}>
        <TextView variant="MobileBody" display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin}>
          {children}
        </TextView>
        <VAIcon name="ChevronRight" fill={iconColor || theme.colors.icon.veteransCrisisLineArrow} width={10} height={15} />
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CtaButton
