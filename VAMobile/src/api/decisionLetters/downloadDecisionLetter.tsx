import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { useReviewEvent } from 'utils/inAppReviews'

import { decisionLettersKeys } from './queryKeys'

const { API_ROOT } = getEnv()

/**
 * Fetch user decision letter
 */
const downloadDecisionLetter = async (id: string, func: () => Promise<void>): Promise<boolean | undefined> => {
  const escapedId = encodeURI(id) // escape chars like {} in document ID
  const decisionLettersEndpoint = `${API_ROOT}/v0/claims/decision-letters/${escapedId}/download`
  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', decisionLettersEndpoint, 'decision_letter.pdf', undefined, 3)
  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => func() })
    return true
  }
}

/**
 * Returns a query for a user decision letter
 */
export const useDownloadDecisionLetter = (id: string, options?: { enabled?: boolean }) => {
  const registerReviewEvent = useReviewEvent(false)
  return useQuery({
    ...options,
    queryKey: [decisionLettersKeys.downloadLetter, id],
    queryFn: () => downloadDecisionLetter(id, registerReviewEvent),
    meta: {
      errorName: 'downloadDecisionLetter: Service error',
    },
  })
}
