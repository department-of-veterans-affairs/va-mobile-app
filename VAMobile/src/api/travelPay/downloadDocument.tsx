import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import { travelPayKeys } from 'api/travelPay'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { useReviewEvent } from 'utils/inAppReviews'

const { API_ROOT } = getEnv()

/**
 * Downloads and opens a travel pay document
 */
const downloadTravelPayDocument = async (
  claimId: string,
  documentId: string,
  filename: string,
  onPreviewDismiss: () => Promise<void> = async () => {},
): Promise<boolean | undefined> => {
  const downloadDocumentEndpoint = `${API_ROOT}/v0/travel-pay/claims/${claimId}/documents/${documentId}`

  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', downloadDocumentEndpoint, filename, undefined, 3)

  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => onPreviewDismiss() })
    return true
  }
}

/**
 * Hook for downloading travel pay documents
 */
export const useDownloadTravelPayDocument = (
  claimId: string,
  documentId: string,
  filename: string,
  options?: { enabled?: boolean },
) => {
  const registerReviewEvent = useReviewEvent()
  return useQuery({
    ...options,
    queryKey: [travelPayKeys.downloadDocument, claimId, documentId],
    queryFn: () => downloadTravelPayDocument(claimId, documentId, filename, registerReviewEvent),
    meta: {
      errorName: 'downloadTravelPayDocument: Service error',
    },
  })
}
