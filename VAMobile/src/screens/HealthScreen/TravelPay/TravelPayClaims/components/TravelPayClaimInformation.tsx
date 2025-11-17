import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDetails } from 'api/types'
import { Box, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import TravelPayClaimDocuments from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayClaimDocuments'
import { getFormattedDate } from 'utils/formattingUtils'
import { useTheme } from 'utils/hooks'

type TravelPayClaimInformationProps = {
  /** The claim details data */
  claimDetails: TravelPayClaimDetails
  /** Callback for document downloads */
  onDocumentPress?: (documentId: string, filename: string) => void
}

/**
 * Component that displays the "Claim information" section
 * Shows When (submitted/updated dates), Where (facility info), and Documents
 */
function TravelPayClaimInformation({ claimDetails, onDocumentPress }: TravelPayClaimInformationProps) {
  const { id, claimStatus, documents, createdOn, modifiedOn, appointmentDate, facilityName } = claimDetails
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Statuses that should show "Created on" line
  const showCreatedOn = ['Incomplete', 'Saved', 'Closed with no payment'].includes(claimStatus)

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
        {showCreatedOn && (
          <TextView variant="MobileBody" testID="travelPayClaimInformationSubmittedOnTestID">
            {t('travelPay.claimDetails.information.createdOn', {
              date: getFormattedDate(createdOn, 'EEEE, MMMM d, yyyy'),
              time: getFormattedDate(createdOn, 'h:mm a'),
            })}
          </TextView>
        )}
        <TextView variant="MobileBody" testID="travelPayClaimInformationUpdatedOnTestID">
          {t('travelPay.claimDetails.information.updatedOn', {
            date: getFormattedDate(modifiedOn, 'EEEE, MMMM d, yyyy'),
            time: getFormattedDate(modifiedOn, 'h:mm a'),
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
            date: getFormattedDate(appointmentDate, 'EEEE, MMMM d, yyyy'),
            time: getFormattedDate(appointmentDate, 'h:mm a'),
          })}
        </TextView>
        <TextView variant="MobileBody">{facilityName}</TextView>
      </Box>

      {/* Documents Section */}
      {documents && documents.length > 0 && (
        <TravelPayClaimDocuments
          documents={documents}
          claimId={id}
          claimStatus={claimStatus}
          onDocumentPress={onDocumentPress}
        />
      )}
    </Box>
  )
}

export default TravelPayClaimInformation
