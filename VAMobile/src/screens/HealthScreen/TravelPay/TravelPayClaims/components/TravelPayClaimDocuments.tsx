import React from 'react'
import { useTranslation } from 'react-i18next'

import { TravelPayClaimDocument } from 'api/types'
import { AccordionCollapsible, Box, DefaultList, DefaultListItemObj, TextView } from 'components'
import { TextLine } from 'components/types'
import { NAMESPACE } from 'constants/namespaces'
import { useTravelPayDocumentDownload } from 'screens/HealthScreen/TravelPay/TravelPayClaims/components/TravelPayDocumentDownload'
import { VATypographyThemeVariants } from 'styles/theme'
import { getA11yLabelText } from 'utils/common'
import { useTheme } from 'utils/hooks'

type TravelPayClaimDocumentsProps = {
  /** Array of documents to display */
  documents: TravelPayClaimDocument[]
  /** The claim ID for analytics */
  claimId: string
  /** The claim status for analytics */
  claimStatus: string
}

/**
 * Helper function to create document list items for the accordion
 */
const createDocumentListItems = (
  documents: TravelPayClaimDocument[],
  claimId: string,
  claimStatus: string,
  onDownload: (documentId: string, filename: string) => void,
): Array<DefaultListItemObj> => {
  const variant = 'MobileBody' as keyof VATypographyThemeVariants

  return documents.map((document) => {
    const textLines: Array<TextLine> = [
      {
        text: document.filename,
        variant,
      },
    ]

    return {
      textLines,
      onPress: () => onDownload(document.documentId, document.filename),
      testId: getA11yLabelText(textLines),
      a11yHintText: `Download ${document.filename}`,
    }
  })
}

/**
 * Component that displays the "Documents added to this claim" section
 * Shows user-submitted documents in a collapsible accordion with a list
 */
function TravelPayClaimDocuments({ documents, claimId, claimStatus }: TravelPayClaimDocumentsProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { downloadDocument } = useTravelPayDocumentDownload(claimId, claimStatus)

  // Filter out decision/rejection letters since those are handled separately
  const userSubmittedDocuments = documents.filter(
    (doc) => !doc.filename.includes('Rejection Letter') && !doc.filename.includes('Decision Letter'),
  )

  // Don't render if there are no user-submitted documents
  if (userSubmittedDocuments.length === 0) {
    return null
  }

  const accordionHeader = (
    <TextView variant="MobileBodyBold" accessibilityRole="header">
      {t('travelPay.claimDetails.information.documentsSubmitted')}
    </TextView>
  )

  const accordionContent = (
    <Box mx={-theme.dimensions.gutter} mt={theme.dimensions.standardMarginBetween}>
      <DefaultList items={createDocumentListItems(userSubmittedDocuments, claimId, claimStatus, downloadDocument)} />
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
