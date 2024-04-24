import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { LinkProps } from '@department-of-veterans-affairs/mobile-component-library/src/components/Link/Link'

import { AppointmentPhone } from 'api/types'
import { Box, LinkWithAnalytics } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { getNumberAccessibilityLabelFromString, getNumbersFromString } from 'utils/formattingUtils'

type ClickToCallPhoneNumberProps = {
  /**sets the phone information */
  phone?: AppointmentPhone | string
  /**sets the text that will be displayed */
  displayedText?: string
  /** boolean to align items to the center */
  center?: boolean
  /** accessibility label - otherwise; defaults to the actual phone number */
  a11yLabel?: string
  /** tty bypass */
  ttyBypass?: boolean
  /** color variant */
  variant?: 'default' | 'base'
}

/**A common component for a blue underlined phone number with a phone icon beside it - clicking brings up phone app - automatically renders TTY info*/
const ClickToCallPhoneNumber: FC<ClickToCallPhoneNumberProps> = ({
  phone,
  displayedText,
  center,
  a11yLabel,
  ttyBypass,
  variant,
}) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  if (!phone) {
    return <></>
  }

  const phoneNumber = typeof phone === 'string' ? phone : `${phone.areaCode}-${phone.number}`

  const clickToCallProps: LinkProps = {
    type: 'call',
    phoneNumber: getNumbersFromString(phoneNumber),
    text: displayedText || phoneNumber,
    a11yLabel: a11yLabel || getNumberAccessibilityLabelFromString(phoneNumber),
    variant,
    testID: 'CallVATestID',
  }

  const ttyProps: LinkProps = {
    type: 'call TTY',
    TTYnumber: t('contactVA.tty.number'),
    text: t('contactVA.tty.displayText'),
    a11yLabel: t('contactVA.tty.number.a11yLabel'),
    variant,
    testID: 'CallTTYTestID',
  }

  return (
    <Box alignItems={center ? 'center' : undefined}>
      <LinkWithAnalytics {...clickToCallProps} />
      {!ttyBypass && <LinkWithAnalytics {...ttyProps} />}
    </Box>
  )
}

export default ClickToCallPhoneNumber
