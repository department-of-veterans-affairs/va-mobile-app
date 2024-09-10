import FileViewer from 'react-native-file-viewer'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData } from 'api/types'
import store from 'store'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { registerReviewEvent } from 'utils/inAppReviews'

import { decisionLettersKeys } from './queryKeys'

const { API_ROOT } = getEnv()

/**
 * Fetch user decision letter
 */
const downloadDecisionLetter = async (id: string, queryClient: QueryClient): Promise<boolean | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === decisionLettersKeys.downloadLetter[0]) {
        throw error.error
      }
    })
  }
  const escapedId = encodeURI(id) // escape chars like {} in document ID
  const decisionLettersEndpoint = `${API_ROOT}/v0/claims/decision-letters/${escapedId}/download`
  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME)
    : await downloadFile('GET', decisionLettersEndpoint, 'decision_letter.pdf', undefined, 3)
  if (filePath) {
    await FileViewer.open(filePath, { onDismiss: () => registerReviewEvent() })
    return true
  }
}

/**
 * Returns a query for a user decision letter
 */
export const useDownloadDecisionLetter = (id: string, options?: { enabled?: boolean }) => {
  const queryClient = useQueryClient()
  return useQuery({
    ...options,
    queryKey: [decisionLettersKeys.downloadLetter, id],
    queryFn: () => downloadDecisionLetter(id, queryClient),
    meta: {
      errorName: 'downloadDecisionLetter: Service error',
    },
  })
}
