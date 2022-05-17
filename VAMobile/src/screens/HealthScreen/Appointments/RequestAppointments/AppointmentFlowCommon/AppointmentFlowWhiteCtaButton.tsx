import React, { FC } from 'react'

import { CtaButton, CtaButtonProps, TextView } from 'components/index'

export type AppointmentFlowWhiteCtaButtonProps = {
  /** function called when the banner is pressed */
  onPress: () => void
  /** sets the button text */
  text: string
}

/**
 * Common component for the white cta button for the appointment request flow
 */
const AppointmentFlowWhiteCtaButton: FC<AppointmentFlowWhiteCtaButtonProps> = ({ onPress, text }) => {
  const props: CtaButtonProps = { onPress, backgroundColor: 'buttonSecondary', iconColor: 'error', px: 15, py: 15, justifyContent: 'space-between' }

  return (
    <CtaButton {...props}>
      <TextView color={'primary'} variant={'AppointmentRequestCtaBtnText'}>
        {text}
      </TextView>
    </CtaButton>
  )
}

export default AppointmentFlowWhiteCtaButton
