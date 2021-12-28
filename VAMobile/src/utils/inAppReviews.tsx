import { DateTime } from 'luxon'
import { requestReview } from './rnReviews'
import { versionName } from './deviceData'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const STORAGE_REVIEW_EVENT_KEY = '@review_event'
export const STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS = '@last_review_date'
export const STORAGE_LAST_REVIEW_VERSION = '@last_review_version'
export const IN_APP_REVIEW_INTERVAL_DAYS = 122

export const registerReviewEvent = async (): Promise<void> => {
  const prev = await AsyncStorage.getItem(STORAGE_REVIEW_EVENT_KEY)
  const total = prev ? parseInt(prev, 10) + 1 : 1
  await AsyncStorage.setItem(STORAGE_REVIEW_EVENT_KEY, `${total}`)
  if (total >= 7) {
    const lastReview = await AsyncStorage.getItem(STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS)
    if (!lastReview) {
      await callReviewAPI()
    } else {
      const days = DateTime.fromMillis(parseInt(lastReview, 10)).diffNow('days').days
      const lastReviewVersion = await AsyncStorage.getItem(STORAGE_LAST_REVIEW_VERSION)
      if (days > IN_APP_REVIEW_INTERVAL_DAYS && lastReviewVersion !== versionName) {
        await callReviewAPI()
      }
    }
  }
}

const callReviewAPI = async (): Promise<void> => {
  await requestReview()
  await AsyncStorage.setItem(STORAGE_REVIEW_EVENT_KEY, '0')
  await AsyncStorage.setItem(STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS, `${DateTime.now().millisecond}`)
  await AsyncStorage.setItem(STORAGE_LAST_REVIEW_VERSION, versionName)
}
