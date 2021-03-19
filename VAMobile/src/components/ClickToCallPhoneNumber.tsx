import React, { FC } from 'react'

import { AppointmentPhone } from 'store/api/types'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { getNumbersFromString } from 'utils/formattingUtils'
import { useTheme, useTranslation } from 'utils/hooks'

type ClickToCallPhoneNumberProps = {
  phone?: AppointmentPhone | string
  displayedText?: string
}

const ClickToCallPhoneNumber: FC<ClickToCallPhoneNumberProps> = ({ phone, displayedText }) => {
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
    accessibilityLabel: getNumbersFromString(phoneNumber),
  }

  const ttyProps: LinkButtonProps = {
    displayedText: t('contactVA.tty.number'),
    linkType: LinkTypeOptionsConstants.callTTY,
    numberOrUrlLink: t('contactVA.tty.number'),
  }

  return (
    <Box mt={theme.dimensions.standardMarginBetween}>
      <ClickForActionLink {...clickToCallProps} {...a11yHintProp(t('contactVA.number.a11yHint'))} />
      <TextView color="primary" variant="MobileBody" my={theme.dimensions.standardMarginBetween / 2}>
        {t('contactVA.tty.body')}
      </TextView>
      <ClickForActionLink {...ttyProps} {...a11yHintProp(t('contactVA.number.a11yHint'))} />
      <TextView color="primary" variant="MobileBody" mt={theme.dimensions.standardMarginBetween / 2}>
        {t('contactVA.tty.hintText')}
      </TextView>
    </Box>
  )
}

export default ClickToCallPhoneNumber
