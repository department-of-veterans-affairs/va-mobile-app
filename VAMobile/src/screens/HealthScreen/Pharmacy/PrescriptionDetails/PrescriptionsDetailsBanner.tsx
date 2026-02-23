import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { PrescriptionData } from 'api/types'
import { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber, getNumberAccessibilityLabelFromString } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'

export type PrescriptionsDetailsBannerProps = {
  /** Optional variant for the alert. Default is 'warning' */
  variant?: 'info' | 'warning' | 'error' | 'success'
  /** Optional phone number to display. Defaults to the standard phone number */
  phoneNumber?: string
  /** Optional array of prescriptions at migrating facilities to display as links */
  migratingPrescriptions?: PrescriptionData[]
}

function PrescriptionsDetailsBanner({
  variant = 'warning',
  phoneNumber,
  migratingPrescriptions,
}: PrescriptionsDetailsBannerProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()

  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  const displayPhone = phoneNumber || t('5418307563')

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
          accessible
          variant="MobileBody"
          accessibilityLabel={a11yLabelVA(t('prescription.details.banner.body1'))}
          mb={standardMarginBetween}>
          {t('prescription.details.banner.body1')}
        </TextView>
        <TextView accessible variant="MobileBody" mb={standardMarginBetween}>
          {t('prescription.details.banner.body2')}
        </TextView>
        <Box>
          <VABulletList listOfText={bullets} paragraphSpacing={true} />
        </Box>
        {migratingPrescriptions && migratingPrescriptions.length > 0 && (
          <Box mt={standardMarginBetween}>
            <TextView accessible variant="MobileBodyBold" mb={standardMarginBetween}>
              {t('prescription.details.banner.relatedMedications', { defaultValue: 'Affected medications:' })}
            </TextView>
            {migratingPrescriptions.map((prescription) => (
              <TextView
                key={prescription.id}
                variant="MobileBodyLink"
                mb={standardMarginBetween}
                onPress={() => navigateTo('PrescriptionDetails', { prescription })}
                accessibilityRole="link">
                {prescription.attributes.prescriptionName}
              </TextView>
            ))}
          </Box>
        )}
        <TextView accessible variant="MobileBody">
          {t('automatedPhoneSystem')}
        </TextView>
        <ClickToCallPhoneNumber
          phone={displayPhone}
          displayedText={`${displayedTextPhoneNumber(displayPhone)}`}
          a11yLabel={`${getNumberAccessibilityLabelFromString(displayPhone)}`}
          variant={'base'}
        />
      </>
    )
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom}>
        <AlertWithHaptics
          variant={variant}
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
