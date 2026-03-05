import React from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@department-of-veterans-affairs/mobile-component-library'

import { Box } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import getEnv from 'utils/env'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { useExternalLink, useShowActionSheet, useTheme } from 'utils/hooks'

const { LINK_URL_ASK_VA_GOV } = getEnv()

type ContactUsDebtButtonProps = {
  showAskVAOption?: boolean
  askVaUrl?: string
  tollFreeNumber?: string
  ttyNumber?: string
  internationalNumber?: string
}

const DEFAULTS = {
  askVaUrl: LINK_URL_ASK_VA_GOV,
  tollFreeNumber: '8008270648',
  ttyNumber: '711',
  internationalNumber: '16127136415',
}

const toTelLink = (phoneNumber: string): string => {
  if (phoneNumber.length === 11) {
    return `tel:+${phoneNumber}`
  }

  return `tel:${phoneNumber}`
}

function ContactUsDebtButton({
  showAskVAOption = true,
  askVaUrl = DEFAULTS.askVaUrl,
  tollFreeNumber = DEFAULTS.tollFreeNumber,
  ttyNumber = DEFAULTS.ttyNumber,
  internationalNumber = DEFAULTS.internationalNumber,
}: ContactUsDebtButtonProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const launchExternalLink = useExternalLink()
  const showActionSheet = useShowActionSheet()

  const onButtonPress = () => {
    const options: string[] = [
      `${t('debts.contactUs.tollFree')}: ${displayedTextPhoneNumber(tollFreeNumber)}`,
      `${t('debts.contactUs.tty')}: ${displayedTextPhoneNumber(ttyNumber)}`,
      `${t('debts.contactUs.international')}: ${displayedTextPhoneNumber(internationalNumber)}`,
    ]

    if (showAskVAOption) {
      options.push(t('debts.contactUs.askVa'))
    }

    options.push(t('cancel'))

    showActionSheet(
      {
        options,
        title: t('debts.contactUs.title'),
        message: t('debts.contactUs.subTitle'),
        cancelButtonIndex: options.length - 1,
      },
      (buttonIndex) => {
        if (buttonIndex === undefined) return

        const TOLL_FREE_INDEX = 0
        const TTY_INDEX = 1
        const INTL_INDEX = 2
        const ASK_VA_INDEX = showAskVAOption ? 3 : -1

        if (buttonIndex === TOLL_FREE_INDEX) {
          launchExternalLink(toTelLink(tollFreeNumber))
          return
        }

        if (buttonIndex === TTY_INDEX) {
          launchExternalLink(toTelLink(ttyNumber))
          return
        }

        if (buttonIndex === INTL_INDEX) {
          launchExternalLink(toTelLink(internationalNumber))
          return
        }

        if (showAskVAOption && buttonIndex === ASK_VA_INDEX) {
          launchExternalLink(askVaUrl)
        }
      },
    )
  }

  return (
    <Box my={theme.dimensions.buttonPadding}>
      <Button label={t('debts.contactUs')} onPress={onButtonPress} />
    </Box>
  )
}

export default ContactUsDebtButton
