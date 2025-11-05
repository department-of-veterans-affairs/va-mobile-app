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
    <Box mt={theme.dimensions.standardMarginBetween}>
      {/* Claim Submission Timeline Section */}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView
          variant="MobileBodyBold"
          accessibilityRole="header"
          testID="travelPayClaimInformationSubmissionTimelineTestID">
          {t('travelPay.claimDetails.information.timeline')}
        </TextView>
        <TextView variant="MobileBody" testID="travelPayClaimInformationSubmittedOnTestID">
          {t('travelPay.claimDetails.information.createdOn', {
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

      {/* Appointment Information Section */}
      <Box mb={theme.dimensions.standardMarginBetween}>
        <TextView variant="MobileBodyBold" accessibilityRole="header">
          {t('travelPay.claimDetails.information.appointmentDateTime.title')}
        </TextView>
        <TextView variant="MobileBody" testID="travelPayClaimInformationAppointmentDateTestID">
          {t('travelPay.claimDetails.information.appointmentDate', {
            date: getFormattedDate(claimDetails.appointmentDate, 'EEEE, MMMM d, yyyy'),
            time: getFormattedDate(claimDetails.appointmentDate, 'h:mm a'),
          })}
        </TextView>
        <TextView variant="MobileBody">{claimDetails.facilityName}</TextView>
      </Box>

      {/* Documents Section */}
      {userSubmittedDocuments.length > 0 && (
        <Box>
          <TextView
            variant="MobileBodyBold"
            accessibilityRole="header"
            testID="travelPayClaimInformationDocumentsSubmittedTitleTestID">
            {t('travelPay.claimDetails.information.documentsSubmitted')}
          </TextView>
          {userSubmittedDocuments.map((document) => (
            <TravelPayDocumentDownload
              key={document.documentId}
              document={document}
              claimId={claimDetails.id}
              claimStatus={claimDetails.claimStatus}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default TravelPayClaimInformation
