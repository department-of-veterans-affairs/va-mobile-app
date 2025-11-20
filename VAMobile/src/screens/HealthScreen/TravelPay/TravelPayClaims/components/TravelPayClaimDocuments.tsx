import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDocument } from 'api/types'
import { AccordionCollapsible, Box, DefaultList, TextView } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import { useTheme } from 'utils/hooks'
import { createTravelPayDocumentListItem } from 'utils/travelPay'

type TravelPayClaimDocumentsProps = {
  /** Array of documents to display */
  documents: TravelPayClaimDocument[]
  /** The claim ID for analytics */
  claimId: string
  /** The claim status for analytics */
  claimStatus: string
  /** Callback for document downloads */
  onDocumentPress?: (documentId: string, filename: string) => void
}

/**
 * Component that displays the "Documents added to this claim" section
 * Shows user-submitted documents in a collapsible accordion with a list
 */
function TravelPayClaimDocuments({ documents, claimId, claimStatus, onDocumentPress }: TravelPayClaimDocumentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()

  // Filter out decision/rejection letters since those are handled separately
  const userSubmittedDocuments = documents.filter(
    (doc) => !doc.filename.includes('Rejection Letter') && !doc.filename.includes('Decision Letter'),
  )

  // Don't render if there are no user-submitted documents
  if (userSubmittedDocuments.length === 0) {
    return null
  }

  // Handler that calls parent's download function
  const handleDownload = (documentId: string, filename: string) => {
    onDocumentPress?.(documentId, filename)
  }

  const accordionHeader = (
    <TextView variant="MobileBodyBold" accessibilityRole="header">
      {t('travelPay.claimDetails.information.documentsSubmitted')}
    </TextView>
  )

  const accordionContent = (
    <Box mx={-theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
      <DefaultList
        items={userSubmittedDocuments.map((doc) =>
          createTravelPayDocumentListItem(doc, claimId, claimStatus, handleDownload, theme, t, undefined, false),
        )}
      />
    </Box>
  )

  return (
    <Box mx={-theme.dimensions.standardMarginBetween}>
      <AccordionCollapsible
        header={accordionHeader}
        expandedContent={accordionContent}
        testID="travelPayClaimInformationDocumentsAccordion"
      />
    </Box>
  )
}

export default TravelPayClaimDocuments
