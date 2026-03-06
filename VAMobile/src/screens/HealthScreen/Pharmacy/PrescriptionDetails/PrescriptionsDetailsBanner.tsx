import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { PrescriptionData } from 'api/types'
import { AppointmentPhone } from 'api/types/AppointmentData'
import { AlertWithHaptics, Box, ClickToCallPhoneNumber, TextView, VABulletList, VAScrollView } from 'components'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import { a11yLabelVA } from 'utils/a11yLabel'
import { logAnalyticsEvent } from 'utils/analytics'
import { displayedTextPhoneNumber, getNumberAccessibilityLabelFromString } from 'utils/formattingUtils'
import { useRouteNavigation, useTheme } from 'utils/hooks'
import { featureEnabled } from 'utils/remoteConfig'

export type PrescriptionsDetailsBannerProps = {
  /** Optional variant for the alert. Default is 'warning' */
  variant?: 'info' | 'warning' | 'error' | 'success'
  /** Optional phone number to display. Defaults to the standard phone number */
  phoneNumber?: string | AppointmentPhone
  /** Optional array of prescriptions at migrating facilities to display as links */
  migratingPrescriptions?: PrescriptionData[]
  /** Optional boolean to show/hide the default body text and bullet list. Default is true */
  showDefaultContent?: boolean
  /** Optional custom text to display when showDefaultContent is false */
  customBodyText?: string
  /** Optional custom header text to display when showDefaultContent is false. Defaults to the standard banner title */
  customHeaderText?: string
  customFooterText?: string
}

function PrescriptionsDetailsBanner({
  variant = 'warning',
  phoneNumber,
  migratingPrescriptions,
  showDefaultContent = true,
  customBodyText,
  customHeaderText,
  customFooterText,
}: PrescriptionsDetailsBannerProps) {
  const theme = useTheme()
  const { t } = useTranslation(NAMESPACE.COMMON)
  const navigateTo = useRouteNavigation()
  const isOHCutoverFlagEnabled = featureEnabled('mhvMedicationsOracleHealthCutover')

  const { contentMarginBottom, standardMarginBetween } = theme.dimensions

  // Resolve phone number from all possible types
  const resolvedPhoneNumber = (() => {
    if (!phoneNumber) return undefined
    if (typeof phoneNumber === 'string') return phoneNumber
    if ('areaCode' in phoneNumber && 'number' in phoneNumber) {
      const { areaCode, number: phoneNum, extension } = phoneNumber
      return `${areaCode}-${phoneNum}${extension ? ` ext. ${extension}` : ''}`
    }
    return undefined
  })()

  const displayPhone = resolvedPhoneNumber || t('5418307563')

  useEffect(() => {
    logAnalyticsEvent(Events.vama_cerner_alert())
  }, [])

  const getHeader = () => {
    if (customHeaderText) {
      return customHeaderText
    }
    return isOHCutoverFlagEnabled ? t('prescription.details.banner.titleV2') : t('prescription.details.banner.title')
  }

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

    const hasOverrides =
      customBodyText ||
      customFooterText ||
      (migratingPrescriptions && migratingPrescriptions.length > 0) ||
      !showDefaultContent

    // Only show the V2 short-body when the flag is on AND no overrides are provided
    if (isOHCutoverFlagEnabled && !hasOverrides) {
      return (
        <>
          {/*eslint-disable-next-line react-native-a11y/has-accessibility-hint*/}
          <TextView
            accessible
            variant="MobileBody"
            accessibilityLabel={a11yLabelVA(t('prescription.details.banner.bodyV2'))}
            mb={standardMarginBetween}>
            {t('prescription.details.banner.bodyV2')}
          </TextView>
        </>
      )
    }

    return (
      <>
        {showDefaultContent && (
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
          </>
        )}
        {customBodyText && (
          <TextView accessible variant="MobileBody" mb={standardMarginBetween}>
            {customBodyText}
          </TextView>
        )}
        {migratingPrescriptions && migratingPrescriptions.length > 0 && (
          <Box>
            <TextView accessible variant="MobileBody" mb={standardMarginBetween}>
              {t('prescription.details.banner.migrating.affectedMedications')}
            </TextView>
            {migratingPrescriptions.map((prescription) => (
              <Box key={prescription.id} flexDirection="row" mb={standardMarginBetween}>
                <TextView variant="MobileBody" mr={8}>
                  {'\u2022'}
                </TextView>
                <TextView
                  variant="MobileBodyLink"
                  onPress={() => navigateTo('PrescriptionDetails', { prescription })}
                  accessibilityRole="link">
                  {prescription.attributes.prescriptionName}
                </TextView>
              </Box>
            ))}
          </Box>
        )}
        {customFooterText ? (
          <>
            <TextView accessible variant="MobileBody" mb={standardMarginBetween}>
              {customFooterText}
            </TextView>
          </>
        ) : (
          <>
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
        )}
      </>
    )
  }

  return (
    <VAScrollView>
      <Box mb={contentMarginBottom} mx={theme.dimensions.gutter}>
        <AlertWithHaptics
          variant={variant}
          expandable={true}
          focusOnError={false}
          header={getHeader()}
          analytics={{ onExpand: () => logAnalyticsEvent(Events.vama_cerner_alert_exp()) }}>
          {getContent()}
        </AlertWithHaptics>
      </Box>
    </VAScrollView>
  )
}

export default PrescriptionsDetailsBanner
