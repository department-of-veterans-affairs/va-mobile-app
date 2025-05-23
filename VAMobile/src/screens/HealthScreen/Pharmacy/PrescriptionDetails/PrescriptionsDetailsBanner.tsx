import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber, getNumberAccessibilityLabelFromString } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

function PrescriptionsDetailsBanner() {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)

  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  useEffect(() => {
    logAnalyticsEvent(Events.vama_cerner_alert())
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
      },
      { text: t('prescription.details.banner.bullet4') },
    ]

    return (
      <>
        {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
        <TextView
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('prescription.details.banner.body1'))}
          mb={standardMarginBetween}>
          {t('prescription.details.banner.body1')}
        </TextView>
        <TextView variant="MobileBody" mb={standardMarginBetween}>
          {t('prescription.details.banner.body2')}
        </TextView>
        <Box>
          <VABulletList listOfText={bullets} paragraphSpacing={true} />
        </Box>
        <TextView variant="MobileBody">{t('automatedPhoneSystem')}</TextView>
        <ClickToCallPhoneNumber
          phone={t('5418307563')}
          displayedText={`${displayedTextPhoneNumber(t('5418307563'))}`}
          a11yLabel={`${getNumberAccessibilityLabelFromString(t('5418307563'))}`}
          variant={'base'}
        />
      </>
    )
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <AlertWithHaptics
          variant="warning"
          expandable={true}
          focusOnError={false}
          header={t('prescription.details.banner.title')}
          analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}>
          {getContent()}
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionsDetailsBanner
