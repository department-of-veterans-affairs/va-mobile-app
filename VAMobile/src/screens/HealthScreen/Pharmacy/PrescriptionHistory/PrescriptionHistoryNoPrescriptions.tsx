import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { AlertBox, Box, BoxProps, ClickToCallPhoneNumber, TextView, VABulletList, VABulletListText, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber } from 'utils/formattingUtils'
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

  const medicationsNotIncludedList: Array<VABulletListText> = [
    {
      text: t('prescription.help.item1'),
      a11yLabel: a11yLabelVA(t('prescription.help.item1')),
    },
    {
      text: t('prescription.help.item2'),
      a11yLabel: a11yLabelVA(t('prescription.help.item2')),
    },
    {
      text: t('prescription.help.item3'),
    },
    {
      text: t('prescription.help.item4'),
      a11yLabel: t('prescription.help.item4.a11yLabel'),
    },
    {
      text: t('prescription.help.item5'),
    },
  ]

  return (
    <VAScrollView>
      <Box {...alertWrapperProps}>
        <AlertBox border={'informational'} title={t('prescriptions.notFound.title')} titleA11yLabel={a11yLabelVA(t('prescriptions.notFound.title'))}>
          <TextView pt={theme.paragraphSpacing.spacing20FontSize} mb={theme.dimensions.condensedMarginBetween} accessibilityLabel={a11yLabelVA(t('prescriptions.notFound.yourVA'))}>
            {t('prescriptions.notFound.yourVA')}
          </TextView>
          <VABulletList listOfText={medicationsNotIncludedList} paragraphSpacing={true} />
          <TextView paragraphSpacing={true}>{t('prescriptions.notFound.bullets.ifYouThink')}</TextView>
          <ClickToCallPhoneNumber displayedText={displayedTextPhoneNumber(t('8773270022'))} phone={t('8773270022')} />
        </AlertBox>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionHistoryNoPrescriptions
