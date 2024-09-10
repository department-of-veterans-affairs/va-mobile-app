import FileViewer from 'react-native-file-viewer'

import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query'
import _ from 'lodash'

import { errorKeys } from 'api/errors'
import { ErrorData, LetterTypes, LettersDownloadParams } from 'api/types'
import { Events, UserAnalytics } from 'constants/analytics'
import store from 'store'
import { Params } from 'store/api'
import { DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME } from 'store/api/demo/letters'
import { logAnalyticsEvent, setAnalyticsUserProperty } from 'utils/analytics'
import getEnv from 'utils/env'
import { downloadDemoFile, downloadFile } from 'utils/filesystem'
import { registerReviewEvent } from 'utils/inAppReviews'

import { lettersKeys } from './queryKeys'

const { API_ROOT } = getEnv()

/**
 * Fetch user letter
 */
const downloadLetter = async (
  letterType: LetterTypes,
  lettersOption: LettersDownloadParams,
  queryClient: QueryClient,
): Promise<boolean | undefined> => {
  const data = queryClient.getQueryData(errorKeys.errorOverrides) as ErrorData
  if (data) {
    _.forEach(data.overrideErrors, (error) => {
      if (error.queryKey[0] === lettersKeys.downloadLetter[0]) {
        throw error.error
      }
    })
  }
  const lettersAPI = `${API_ROOT}/v0/letters/${letterType}/download`
  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME, lettersOption as unknown as Params)
    : await downloadFile('POST', lettersAPI, `${letterType}.pdf`, lettersOption as unknown as Params, 3)
  if (filePath) {
    logAnalyticsEvent(Events.vama_letter_download(letterType))
    setAnalyticsUserProperty(UserAnalytics.vama_uses_letters())
    await FileViewer.open(filePath, { onDismiss: () => registerReviewEvent() })
    return true
  }
}

/**
 * Returns a query for a user letter
 */
export const useDownloadLetter = (letterType: LetterTypes, lettersOption: LettersDownloadParams) => {
  const queryClient = useQueryClient()

  return useQuery({
    enabled: false,
    queryKey: [lettersKeys.downloadLetter, letterType, lettersOption],
    queryFn: () => downloadLetter(letterType, lettersOption, queryClient),
    meta: {
      errorName: 'downloadLetter: Service error',
    },
  })
}
