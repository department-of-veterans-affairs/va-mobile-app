import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AlertBox, Box, BoxProps, ClickToCallPhoneNumber, TextView, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

const PrescriptionHistoryNoPrescriptions: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  useEffect(() => {
    logAnalyticsEvent(Events.vama_rx_na())
  }, [])

  const alertWrapperProps: BoxProps = {
    mb: theme.dimensions.contentMarginBottom,
  }

  const bullets: string[] = [
    t('prescriptions.notFound.bullets.one'),
    t('prescriptions.notFound.bullets.two'),
    t('prescriptions.notFound.bullets.three'),
    t('prescriptions.notFound.bullets.four'),
  ]

  return (
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertBox border={'informational'} title={t('prescriptions.notFound.title')} titleA11yLabel={t('prescriptions.notFound.title.a11y')}>
          <TextView pt={theme.paragraphSpacing.spacing20FontSize} paragraphSpacing={true} accessibilityLabel={t('prescriptions.notFound.yourVA.a11y')}>
            {t('prescriptions.notFound.yourVA')}
          </TextView>
          <VABulletList listOfText={bullets} paragraphSpacing={true} />
          <TextView paragraphSpacing={true}>{t('prescriptions.notFound.bullets.ifYouThink')}</TextView>
          <ClickToCallPhoneNumber displayedText={t('8773270022.displayText')} phone={t('8773270022')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoPrescriptions
