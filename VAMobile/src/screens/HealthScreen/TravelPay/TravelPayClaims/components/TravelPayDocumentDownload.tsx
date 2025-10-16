import React from 'react'
import { useTranslation } from 'react-i18next'
import FileViewer from 'react-native-file-viewer'

import { Icon } from '@department-of-veterans-affairs/mobile-component-library'
import { useQuery } from '@tanstack/react-query'

import { TravelPayClaimDocument } from 'api/types'
import { Box, LinkWithAnalytics } from 'components'
import { NAMESPACE } from 'constants/namespaces'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { useTheme } from 'utils/hooks'
import { useReviewEvent } from 'utils/inAppReviews'

const { API_ROOT } = getEnv()

type TravelPayDocumentDownloadProps = {
  /** The document to download */
  document: TravelPayClaimDocument
  /** Custom text to display for the link */
  linkText?: string
  /** The claim ID for analytics */
  claimId: string
}

/**
 * Downloads and opens a travel pay document
 * Following the same pattern as other document downloads in the codebase
 */
const downloadTravelPayDocument = async (
  claimId: string,
  documentId: string,
  filename: string,
  onPreviewDismiss: () => Promise<void> = async () => {},
): Promise<boolean | undefined> => {
  const decisionLettersEndpoint = `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}/download`

  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', decisionLettersEndpoint, filename, undefined, 3)

  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => onPreviewDismiss() })
    return true
  }
}

/**
 * Component that displays a downloadable document link
 * Uses the established document download pattern from the codebase
 */
function TravelPayDocumentDownload({ document, linkText, claimId }: TravelPayDocumentDownloadProps) {
  const { t } = useTranslation(NAMESPACE.COMMON)
  const theme = useTheme()
  const registerReviewEvent = useReviewEvent()

  const displayText = linkText || document.filename

  const { refetch: downloadDocument, isFetching: isDownloading } = useQuery({
    queryKey: ['travelPayDocument', claimId, document.documentId],
    queryFn: () => downloadTravelPayDocument(claimId, document.documentId, document.filename, registerReviewEvent),
    enabled: false,
  })

  const handleDocumentDownload = () => {
    if (!isDownloading) {
      downloadDocument()
    }
  }

  return (
    <Box flexDirection="row" alignItems="center">
      <Box mt={theme.dimensions.attachmentIconTopMargin} mr={theme.dimensions.textIconMargin}>
        <Icon name="FileDownload" width={20} height={20} fill={theme.colors.icon.link} />
      </Box>
      <LinkWithAnalytics
        type="custom"
        onPress={handleDocumentDownload}
        text={isDownloading ? t('travelPay.claimDetails.document.downloading') : displayText}
        a11yLabel={t('travelPay.claimDetails.document.downloadA11yLabel', { filename: displayText })}
        testID={`document-download-${document.documentId}`}
      />
    </Box>
  )
}

export default TravelPayDocumentDownload
