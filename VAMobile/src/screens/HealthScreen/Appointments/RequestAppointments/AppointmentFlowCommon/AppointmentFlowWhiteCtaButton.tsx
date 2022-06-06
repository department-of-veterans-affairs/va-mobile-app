import React, { FC } from 'react'

import { Box, BoxProps, CtaButton, CtaButtonProps, TextView } from 'components/index'

export type AppointmentFlowWhiteCtaButtonProps = {
  /** function called when the banner is pressed */
  onPress: () => void
  /** sets the button text */
  text: string
  /** sets the button label defaults to crsisis line label */
  label?: string
  /** sets the button hint defaults to crsisis line hint */
  hint?: string
} & BoxProps

/**
 * Common component for the white cta button for the appointment request flow
 */
const AppointmentFlowWhiteCtaButton: FC<AppointmentFlowWhiteCtaButtonProps> = ({ onPress, text, label, hint, mx, ml, my, mr }) => {
  const props: CtaButtonProps = {
    onPress,
    backgroundColor: 'buttonSecondary',
    iconColor: 'error',
    px: 15,
    py: 15,
    justifyContent: 'space-between',
    accessibilityLabel: label,
    accessibilityHint: hint,
  }

  const buttonWrapperStyle: BoxProps = {
    mx,
    ml,
    my,
    mr,
  }

  return (
    <Box {...buttonWrapperStyle}>
      <CtaButton {...props}>
        <TextView color={'primary'} variant={'AppointmentRequestCtaBtnText'}>
          {text}
        </TextView>
      </CtaButton>
    </Box>
  )
}

export default AppointmentFlowWhiteCtaButton
