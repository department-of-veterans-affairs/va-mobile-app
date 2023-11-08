import { useTranslation } from 'react-i18next'
import React, { FC, useEffect } from 'react'

import { Box, ClickToCallPhoneNumber, CollapsibleAlert, TextView, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { displayedTextPhoneNumber, getNumberAccessibilityLabelFromString } from 'utils/formattingUtils'
import { logAnalyticsEvent } from 'utils/analytics'
import { useTheme } from 'utils/hooks'

const PrescriptionsDetailsBanner: FC = () => {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  useEffect(() => {
    logAnalyticsEvent(Events.vama_rx_refill_cerner())
  }, [])

  const getContent = () => {
    const bullets = [
      {
        text: t('prescription.details.banner.bullet1'),
        boldedText: ' ' + t('or'),
        a11yLabel: a11yLabelVA(t('prescription.details.banner.bullet1')) + ' ' + t('or'),
      },
      {
        text: t('prescription.details.banner.bullet2'),
        boldedText: ' ' + t('or'),
        a11yLabel: a11yLabelVA(t('prescription.details.banner.bullet2')) + ' ' + t('or'),
      },
      {
        text: t('prescription.details.banner.bullet3'),
        boldedText: ' ' + t('or'),
        a11yLabel: t('prescription.details.banner.bullet3') + ' ' + t('or'),
      },
      { text: t('prescription.details.banner.bullet4') },
    ]

    return (
      <>
        <TextView variant="MobileBody" accessibilityLabel={a11yLabelVA(t('prescription.details.banner.body1'))} mb={standardMarginBetween}>
          {t('prescription.details.banner.body1')}
        </TextView>
        <TextView variant="MobileBody" mb={standardMarginBetween}>
          {t('prescription.details.banner.body2')}
        </TextView>
        <Box>
          <VABulletList listOfText={bullets} />
        </Box>
        <ClickToCallPhoneNumber
          phone={t('5418307563')}
          displayedText={`${t('automatedPhoneSystem')} ${displayedTextPhoneNumber(t('5418307563'))}`}
          a11yLabel={`${t('automatedPhoneSystem')} ${getNumberAccessibilityLabelFromString(t('5418307563'))}`}
        />
      </>
    )
  }

  const onExpand = () => {
    logAnalyticsEvent(Events.vama_rx_cerner_exp())
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <CollapsibleAlert
          border="warning"
          headerText={t('prescription.details.banner.title')}
          body={getContent()}
          a11yLabel={t('prescription.details.banner.title')}
          onExpand={onExpand}
        />
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionsDetailsBanner
