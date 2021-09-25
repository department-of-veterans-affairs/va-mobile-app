import React, { FC } from 'react'

import { AppointmentPhone } from 'store/api/types'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { getNumberAccessibilityLabelFromString, getNumbersFromString } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type ClickToCallPhoneNumberProps = {
  phone?: AppointmentPhone | string | null
  displayedText?: string
  center?: boolean
}

const ClickToCallPhoneNumber: FC<ClickToCallPhoneNumberProps> = ({ phone, displayedText, center }) => {
  const t = useTranslation(NAMESPACE.HOME)
  const theme = useTheme()

  if (!phone) {
    return <></>
  }

  const phoneNumber = typeof phone === 'string' ? phone : `${phone.areaCode}-${phone.number}`

  const clickToCallProps: LinkButtonProps = {
    displayedText: displayedText || phoneNumber,
    linkType: LinkTypeOptionsConstants.call,
    numberOrUrlLink: getNumbersFromString(phoneNumber),
    accessibilityLabel: getNumberAccessibilityLabelFromString(phoneNumber),
  }

  const ttyProps: LinkButtonProps = {
    displayedText: t('contactVA.tty.number'),
    linkType: LinkTypeOptionsConstants.callTTY,
    numberOrUrlLink: t('contactVA.tty.number'),
    accessibilityLabel: t('contactVA.tty.number.a11yLabel'),
  }

  return (
    <Box alignItems={center ? 'center' : undefined} mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('contactVA.number.a11yHint'))} />
      <Box accessible={true}>
        <TextView
          textAlign={center ? 'center' : undefined}
          color="primary"
          variant="MobileBody"
          my={theme.dimensions.condensedMarginBetween}
          focusable={true}
          importantForAccessibility="yes">
          {t('contactVA.tty.body')}
        </TextView>
      </Box>
      <ClickForActionLink {...ttyProps} {...a11yHintProp(t('contactVA.number.a11yHint'))} />
      <Box accessible={true}>
        <TextView textAlign={center ? 'center' : undefined} color="primary" variant="MobileBody" mt={theme.dimensions.condensedMarginBetween}>
          {t('contactVA.tty.hintText')}
        </TextView>
      </Box>
    </Box>
  )
}

export default ClickToCallPhoneNumber
