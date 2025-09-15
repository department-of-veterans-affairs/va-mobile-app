import FileViewer from 'react-native-file-viewer'

import { medicalCopayKeys } from 'api/medicalCopays/queryKeys'
import { useQuery } from 'api/queryClient'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { useReviewEvent } from 'utils/inAppReviews'

const { API_ROOT } = getEnv()

/**
 * Returns the copayment statement file name
 */
const createCopayStatementFileName = (id: string) => `VA-Medical-Copay-Statement-${id}.pdf`

/**
 * Downloads and opens the PDF statement for a given copay statement ID.
 */
export const downloadCopayStatement = async (
  id: string,
  fileName?: string,
  onPreviewDismiss: () => Promise<void> = async () => {},
): Promise<boolean | undefined> => {
  const escapedId = encodeURI(id)
  const url = `${API_ROOT}/v0/medical_copays/download/${escapedId}`

  const localName = (fileName ?? createCopayStatementFileName(id)).trim()

  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', url, localName, undefined, 3)

  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => onPreviewDismiss() })
    return true
  }
}

export const useDownloadCopayStatement = (id: string, options?: { enabled?: boolean; fileName?: string }) => {
  const registerReviewEvent = useReviewEvent(false)
  return useQuery({
    ...options,
    queryKey: [medicalCopayKeys.downloadCopayStatement, id],
    queryFn: () => downloadCopayStatement(id, options?.fileName, registerReviewEvent),
    meta: {
      errorName: 'downloadCopayStatement: Service error',
    },
  })
}
