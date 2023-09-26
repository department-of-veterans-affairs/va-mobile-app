import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AlertBox, Box, BoxProps, ClickToCallPhoneNumber, TextArea, TextView, TextViewProps, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useExternalLink, useTheme } from 'utils/hooks'
import getEnv from 'utils/env'

const { LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT } = getEnv()

const PrescriptionHistoryNotAuthorized: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const { standardMarginBetween } = theme.dimensions
  const launchExternalLink = useExternalLink()

  useEffect(() => {
    logAnalyticsEvent(Events.vama_rx_noauth())
  }, [])

  const alertWrapperProps: BoxProps = {
    mb: standardMarginBetween,
  }

  const bulletOne = {
    text: t('prescriptions.notAuthorized.enrolled'),
    boldedText: ' ' + t('and'),
    a11yLabel: a11yLabelVA(t('prescriptions.notAuthorized.enrolled')) + ' ' + t('and'),
  }

  const bulletTwo = {
    text: t('prescriptions.notAuthorized.registered'),
    a11yLabel: a11yLabelVA(t('prescriptions.notAuthorized.registered')),
  }

  const redirectLink = (): void => {
    launchExternalLink(LINK_URL_UPGRADE_MY_HEALTHEVET_PREMIUM_ACCOUNT)
  }

  const linkProps: TextViewProps = {
    variant: 'MobileBodyLink',
    onPress: redirectLink,
    accessibilityRole: 'link',
    accessibilityLabel: t('notEnrolledSM.learnHowTo'),
    accessibilityHint: t('notEnrolledSM.learnHowTo.a11yHint'),
    paragraphSpacing: true,
  }

  return (
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertBox border={'warning'} title={t('prescriptions.notAuthorized.warning')} titleA11yLabel={a11yLabelVA(t('prescriptions.notAuthorized.warning'))} />
      </Box>
      <Box mb={theme.dimensions.contentMarginBottom}>
        <TextArea>
          <TextView paragraphSpacing={true}>{t('prescriptions.notAuthorized.toAccess')}</TextView>
          <TextView paragraphSpacing={true}>{t('prescriptions.notAuthorized.toUpgrade')}</TextView>
          <VABulletList listOfText={[bulletOne, bulletTwo]} paragraphSpacing={true} />
          <TextView {...linkProps}>{t('notEnrolledSM.learnHowTo')}</TextView>
          <TextView mt={standardMarginBetween} accessibilityLabel={t('prescriptions.notAuthorized.pleaseCall.a11y')}>
            {t('prescriptions.notAuthorized.pleaseCall')}
          </TextView>
          <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8773270022'))} phone={t('8773270022')} />
        </TextArea>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNotAuthorized
