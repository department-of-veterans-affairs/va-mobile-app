import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { registerReviewEvent } from 'utils/inAppReviews'

import { claimsAndAppealsKeys } from './queryKeys'

const { API_ROOT } = getEnv()

/**
 * Fetch user E Folder Document
 */
const downloadEFolderDocument = async (id: string, fileName: string): Promise<boolean | undefined> => {
  const eFolderDocumentAPI = `${API_ROOT}/v0/efolder/documents/${id}/download?file_name=${fileName}}`

  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, fileName)
    : await downloadFile('POST', eFolderDocumentAPI, fileName, undefined, 1)
  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => registerReviewEvent() })
    return true
  }
}

/**
 * Returns a query for a user E Folder Document
 */
export const useDownloadEFolderDocument = (id: string, fileName: string) => {
  return useQuery({
    enabled: false,
    queryKey: [claimsAndAppealsKeys.eFolderDownloadDoc, id, fileName],
    queryFn: () => downloadEFolderDocument(id, fileName),
    meta: {
      errorName: 'downloadEFolderDocument: Service error',
    },
  })
}
