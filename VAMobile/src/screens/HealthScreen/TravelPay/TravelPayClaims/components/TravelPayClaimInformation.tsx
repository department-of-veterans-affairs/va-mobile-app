import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDetails } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import TravelPayDocumentDownload from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import { getFormattedDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimInformationProps = {
  /** The claim details data */
  claimDetails: TravelPayClaimDetails
}

/**
 * Component that displays the "Claim information" section
 * Shows When (submitted/updated dates), Where (facility info), and Documents
 */
function TravelPayClaimInformation({ claimDetails }: TravelPayClaimInformationProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Filter out decision/rejection letters since those are handled separately
  const userSubmittedDocuments =
    claimDetails.documents?.filter(
      (doc) => !doc.filename.includes('Rejection Letter') && !doc.filename.includes('Decision Letter'),
    ) || []

  return (
    <Box mt={theme.dimensions.condensedMarginBetween}>
      {/* Section Header */}
      <TextView variant="MobileBodyBold">{t('travelPay.claimDetails.information.title')}</TextView>

      {/* When Section */}
      <Box mt={theme.dimensions.condensedMarginBetween} mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" testID="travelPayClaimInformationWhenTitleTestID">
          {t('travelPay.claimDetails.information.when')}
        </TextView>
        <TextView variant="MobileBody" testID="travelPayClaimInformationSubmittedOnTestID">
          {t('travelPay.claimDetails.information.submittedOn', {
            date: getFormattedDate(claimDetails.createdOn, 'EEEE, MMMM d, yyyy'),
            time: getFormattedDate(claimDetails.createdOn, 'h:mm a'),
          })}
        </TextView>
        <TextView variant="MobileBody" testID="travelPayClaimInformationUpdatedOnTestID">
          {t('travelPay.claimDetails.information.updatedOn', {
            date: getFormattedDate(claimDetails.modifiedOn, 'EEEE, MMMM d, yyyy'),
            time: getFormattedDate(claimDetails.modifiedOn, 'h:mm a'),
          })}
        </TextView>
      </Box>

      {/* Where Section */}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold">{t('travelPay.claimDetails.information.where')}</TextView>
        <TextView variant="MobileBody" testID="travelPayClaimInformationWhereTestID">
          {claimDetails.facilityName}
        </TextView>
      </Box>

      {/* Documents Section */}
      {userSubmittedDocuments.length > 0 && (
        <Box mb={theme.dimensions.condensedMarginBetween}>
          <TextView variant="MobileBodyBold" testID="travelPayClaimInformationDocumentsSubmittedTitleTestID">
            {t('travelPay.claimDetails.information.documentsSubmitted')}
          </TextView>
          {userSubmittedDocuments.map((document) => (
            <TravelPayDocumentDownload key={document.documentId} document={document} claimId={claimDetails.id} />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default TravelPayClaimInformation
