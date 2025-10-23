import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDetails } from 'api/types'
import { Box, LinkWithAnalytics, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { TravelPayClaimStatuses } from 'constants/travelPay'
import TravelPayDocumentDownload from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import getEnv from 'utils/env'
import { useRouteNavigation, useTheme } from 'utils/hooks'

const { LINK_URL_VA_FORM_10_0998 } = getEnv()

type TravelPayClaimAppealsProps = {
  /** The claim details data */
  claimDetails: TravelPayClaimDetails
}

/**
 * Component that displays the appeals section for denied travel pay claims
 * Only shows when claim status is "Denied"
 */
function TravelPayClaimAppeals({ claimDetails }: TravelPayClaimAppealsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const navigateTo = useRouteNavigation()
  const onSendSecureMessage = () => {
    navigateTo('SecureMessaging', { activeTab: 0 }) // Go to inbox/compose
  }

  // Only show for denied claims
  if (claimDetails.claimStatus !== TravelPayClaimStatuses.Denied.name) {
    return null
  }

  // Look for VA Form 10-0998 in documents
  const form100998 = claimDetails.documents?.find(
    (doc) => doc.filename?.includes('10-0998') || doc.filename?.includes('Form 10-0998'),
  )

  return (
    <Box>
      {/* Gray divider */}
      <Box height={1} mb={theme.dimensions.standardMarginBetween} borderTopWidth={1} borderTopColor={'divider'} />

      {/* Appeals Section */}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold">{t('travelPay.claimDetails.appeals.title')}</TextView>

        <TextView variant="MobileBody">{t('travelPay.claimDetails.appeals.description')}</TextView>

        {/* VA Form 10-0998 Download */}
        {form100998 ? (
          <TravelPayDocumentDownload
            document={form100998}
            linkText={t('travelPay.claimDetails.appeals.formDownload')}
            claimId={claimDetails.id}
          />
        ) : (
          <Box mb={theme.dimensions.standardMarginBetween}>
            <LinkWithAnalytics
              type="url"
              url={LINK_URL_VA_FORM_10_0998}
              text={t('travelPay.claimDetails.appeals.formDownload')}
              a11yLabel={t('travelPay.claimDetails.appeals.formDownloadA11y')}
            />
          </Box>
        )}

        {/* Option 1: Online */}
        <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
          {t('travelPay.claimDetails.appeals.option1Title')}
        </TextView>

        <TextView variant="MobileBody">{t('travelPay.claimDetails.appeals.option1Description')}</TextView>

        <Box mb={theme.dimensions.standardMarginBetween}>
          <LinkWithAnalytics
            type="custom"
            text={t('travelPay.claimDetails.appeals.sendMessage')}
            a11yLabel={t('travelPay.claimDetails.appeals.sendMessageA11y')}
            onPress={onSendSecureMessage}
          />
        </Box>

        {/* Option 2: By mail */}
        <TextView variant="MobileBodyBold" mb={theme.dimensions.condensedMarginBetween}>
          {t('travelPay.claimDetails.appeals.option2Title')}
        </TextView>

        <TextView variant="MobileBody">{t('travelPay.claimDetails.appeals.option2Description')}</TextView>

        {/* Note */}
        <TextView variant="HelperText">
          <TextView variant="HelperTextBold">{t('travelPay.claimDetails.appeals.noteLabel')}</TextView>{' '}
          {t('travelPay.claimDetails.appeals.noteText')}
        </TextView>
      </Box>
    </Box>
  )
}

export default TravelPayClaimAppeals
