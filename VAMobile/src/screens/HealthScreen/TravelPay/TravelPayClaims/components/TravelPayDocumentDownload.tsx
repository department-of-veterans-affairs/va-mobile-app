import React from 'react'
import { useTranslation } from 'react-i18next'
import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import { TravelPayClaimDocument } from 'api/types'
import { Box, DefaultList, DefaultListItemObj } from 'components'
import { TextLine } from 'components/types'
import { Events } from 'constants/analytics'
import { NAMESPACE } from 'constants/namespaces'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import { VATypographyThemeVariants } from 'styles/theme'
import { logAnalyticsEvent } from 'utils/analytics'
import { getA11yLabelText } from 'utils/common'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'

const { API_ROOT } = getEnv()

/**
 * Determines the document type based on filename patterns
 * Following the same logic used in TravelPayClaimDetailsScreen and TravelPayClaimInformation
 */
export const getDocumentType = (filename: string): string => {
  if (!filename) {
    return 'unknown'
  }
  if (filename.includes('Rejection Letter')) {
    return 'rejection_letter'
  }
  if (filename.includes('Decision Letter')) {
    return 'decision_letter'
  }
  if (filename.includes('10-0998') || filename.includes('Form 10-0998')) {
    return 'form_10_0998'
  }
  return 'user_submitted'
}

/**
 * Custom hook to handle travel pay document downloads
 * Provides a download handler that logs analytics and triggers the download
 */
export const useTravelPayDocumentDownload = (claimId: string, claimStatus: string) => {
  const registerReviewEvent = useReviewEvent()

  const downloadDocument = async (documentId: string, filename: string) => {
    // Log analytics
    const documentType = getDocumentType(filename)
    logAnalyticsEvent(Events.vama_travel_pay_doc_dl(claimId, claimStatus, documentType, filename))

    // Download and open the document
    await downloadTravelPayDocument(claimId, documentId, filename, registerReviewEvent)
  }

  return { downloadDocument }
}

type TravelPayDocumentDownloadProps = {
  /** The document to download */
  document: TravelPayClaimDocument
  /** Custom text to display for the link */
  linkText?: string
  /** The claim ID for analytics */
  claimId: string
  /** The claim status for analytics */
  claimStatus?: string
}

/**
 * Downloads and opens a travel pay document
 * Following the same pattern as other document downloads in the codebase
 */
export const downloadTravelPayDocument = async (
  claimId: string,
  documentId: string,
  filename: string,
  onPreviewDismiss: () => Promise<void> = async () => {},
): Promise<boolean | undefined> => {
  const decisionLettersEndpoint = `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}`

  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', decisionLettersEndpoint, filename, undefined, 3)

  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => onPreviewDismiss() })
    return true
  }
}

/**
 * Component that displays a downloadable document link as a list item
 */
function TravelPayDocumentDownload({ document, linkText, claimId, claimStatus }: TravelPayDocumentDownloadProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const { downloadDocument } = useTravelPayDocumentDownload(claimId, claimStatus || 'unknown')

  const { refetch: triggerDownload, isFetching: isDownloading } = useQuery({
    queryKey: ['travelPayDocument', claimId, document.documentId],
    queryFn: () => downloadDocument(document.documentId, document.filename),
    enabled: false,
  })

  const handleDocumentDownload = () => {
    if (!isDownloading) {
      triggerDownload()
    }
  }

  // Build list item following the Claim Letters pattern
  const variant = 'MobileBody' as keyof VATypographyThemeVariants
  const textLines: Array<TextLine> = [
    {
      text: linkText || document.filename,
      variant,
    },
  ]

  const listItems: Array<DefaultListItemObj> = [
    {
      textLines,
      onPress: handleDocumentDownload,
      testId: getA11yLabelText(textLines),
      a11yHintText: t('travelPay.claimDetails.document.downloadDecisionLetter'),
    },
  ]

  // Wrap in Box with negative horizontal margin to align with body text
  // BaseListItem adds gutter padding which we need to compensate for
  return (
    <Box mx={-theme.dimensions.gutter}>
      <DefaultList items={listItems} />
    </Box>
  )
}

export default TravelPayDocumentDownload
