import FileViewer from 'react-native-file-viewer'

import { useQuery } from '@tanstack/react-query'

import { LetterTypes, LettersDownloadParams } from 'api/types'
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
): Promise<boolean | undefined> => {
  const lettersAPI = `${API_ROOT}/v0/letters/${letterType}/download`
  const filePath = store.getState().demo.demoMode
    ? await downloadDemoFile(DEMO_MODE_LETTER_ENDPOINT, DEMO_MODE_LETTER_NAME, lettersOption as unknown as Params)
    : await downloadFile('POST', lettersAPI, `${letterType}.pdf`, lettersOption as unknown as Params, 3)
  if (filePath) {
    registerReviewEvent()
    logAnalyticsEvent(Events.vama_letter_download(letterType))
    setAnalyticsUserProperty(UserAnalytics.vama_uses_letters())
    await FileViewer.open(filePath)
    return true
  }
}

/**
 * Returns a query for a user letter
 */
export const useDownloadLetter = (letterType: LetterTypes, lettersOption: LettersDownloadParams) => {
  return useQuery({
    enabled: false,
    queryKey: [lettersKeys.downloadLetter, letterType, lettersOption],
    queryFn: () => downloadLetter(letterType, lettersOption),
    meta: {
      errorName: 'downloadLetter: Service error',
    },
  })
}
