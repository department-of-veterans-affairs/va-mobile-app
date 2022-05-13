import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'

import { AppointmentPhone } from 'store/api/types'
import { Box, ClickForActionLink, LinkButtonProps, LinkTypeOptionsConstants, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { a11yHintProp } from 'utils/accessibility'
import { getNumberAccessibilityLabelFromString, getNumbersFromString } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type ClickToCallPhoneNumberProps = {
  /**sets the phone information */
  phone?: AppointmentPhone | string
  /**sets the text that will be displayed */
  displayedText?: string
  /** boolean to align items to the center */
  center?: boolean
}

/**A common component for a blue underlined phone number with a phone icon beside it - clicking brings up phone app - automatically renders TTY info*/
const ClickToCallPhoneNumber: FC<ClickToCallPhoneNumberProps> = ({ phone, displayedText, center }) => {
  const { t } = useTranslation(NAMESPACE.HOME)
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
        <TextView textAlign={center ? 'center' : undefined} variant="MobileBody" my={theme.dimensions.condensedMarginBetween} focusable={true} importantForAccessibility="yes">
          {t('contactVA.tty.body')}
        </TextView>
      </Box>
      <ClickForActionLink {...ttyProps} {...a11yHintProp(t('contactVA.number.a11yHint'))} />
      <Box accessible={true}>
        <TextView textAlign={center ? 'center' : undefined} variant="HelperText" mt={theme.dimensions.condensedMarginBetween}>
          {t('contactVA.tty.hintText')}
        </TextView>
      </Box>
    </Box>
  )
}

export default ClickToCallPhoneNumber
