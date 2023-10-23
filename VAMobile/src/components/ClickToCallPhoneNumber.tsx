import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentPhone } from 'store/api/types'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants } from 'components'
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
  /** color bypass */
  colorOverride?: string
}

/**A common component for a blue underlined phone number with a phone icon beside it - clicking brings up phone app - automatically renders TTY info*/
const ClickToCallPhoneNumber: FC<ClickToCallPhoneNumberProps> = ({ phone, displayedText, center, a11yLabel, ttyBypass, colorOverride }) => {
  const { t } = useTranslation(NAMESPACE.COMMON)

  if (!phone) {
    return <></>
  }

  const phoneNumber = typeof phone === 'string' ? phone : `${phone.areaCode}-${phone.number}`

  const clickToCallProps: LinkButtonProps = {
    displayedText: displayedText || phoneNumber,
    linkType: LinkTypeOptionsConstants.call,
    numberOrUrlLink: getNumbersFromString(phoneNumber),
    a11yLabel: a11yLabel || getNumberAccessibilityLabelFromString(phoneNumber),
    colorOverride: colorOverride,
  }

  const ttyProps: LinkButtonProps = {
    displayedText: t('contactVA.tty.displayText'),
    linkType: LinkTypeOptionsConstants.callTTY,
    numberOrUrlLink: t('contactVA.tty.number'),
    a11yLabel: t('contactVA.tty.number.a11yLabel'),
    colorOverride: colorOverride,
  }

  return (
    <Box alignItems={center ? 'center' : undefined}>
      <ClickForActionLink {...clickToCallProps} testID="CallVATestID" />
      {!ttyBypass && <ClickForActionLink {...ttyProps} testID="CallTTYTestID" />}
    </Box>
  )
}

export default ClickToCallPhoneNumber
