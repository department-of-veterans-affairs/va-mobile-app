import React, { FC } from 'react'

import { TouchableWithoutFeedback, TouchableWithoutFeedbackProps } from 'react-native'
import { a11yHintProp, testIdProps } from 'utils/accessibility'
import { useTheme, useTranslation } from 'utils/hooks'
import Box, { BoxProps } from './Box'
import TextView from './TextView'
import VAIcon from './VAIcon'

/**
 * CtaButton that shows up on the HomeScreen' and 'Contact VA' option on HomeScreen
 *
 * @returns CtaButton component
 */
const CtaButton: FC = (props) => {
  const t = useTranslation()
  const theme = useTheme()
  const wrapperProps = { ...props }
  delete wrapperProps.children

  const touchableProps: TouchableWithoutFeedbackProps = {
    accessibilityRole: 'button',
    accessible: true,
  }

  const boxProps: BoxProps = {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    backgroundColor: 'ctaButton',
    minHeight: theme.dimensions.touchableMinHeight,
    mb: theme.dimensions.standardMarginBetween,
    py: theme.dimensions.buttonPadding,
    px: theme.dimensions.cardPadding,
  }

  return (
    <TouchableWithoutFeedback {...wrapperProps} {...touchableProps} {...testIdProps('talk-to-the-veterans-crisis-line-now')} {...a11yHintProp(t('home:component.crisisLine.hint'))}>
      <Box {...boxProps}>
        <TextView variant="MobileBody" display="flex" flexDirection="row" color="primaryContrast" mr={theme.dimensions.textIconMargin} importantForAccessibility={'no'}>
          {props.children}
        </TextView>
        <VAIcon name="ArrowRight" fill="#FFF" width={10} height={15} />
      </Box>
    </TouchableWithoutFeedback>
  )
}

export default CtaButton
