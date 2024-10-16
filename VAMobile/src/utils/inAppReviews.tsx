import AsyncStorage from '@react-native-async-storage/async-storage'

import { DateTime } from 'luxon'

import { Events } from 'constants/analytics'

import { logAnalyticsEvent } from './analytics'
import { getVersionName } from './deviceData'
import { featureEnabled } from './remoteConfig'
import { requestReview } from './rnReviews'

export const STORAGE_REVIEW_EVENT_KEY = '@review_event'
export const STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS = '@last_review_date'
export const STORAGE_LAST_REVIEW_VERSION = '@last_review_version'
export const IN_APP_REVIEW_INTERVAL_DAYS = 122
export const IN_APP_REVIEW_ACTIONS_THRESHOLD = 7

export const registerReviewEvent = async (screenView?: boolean): Promise<void> => {
  if (!featureEnabled('inAppReview')) return
  const prev = await AsyncStorage.getItem(STORAGE_REVIEW_EVENT_KEY)
  const total = prev ? parseInt(prev, 10) + 1 : 1
  await AsyncStorage.setItem(STORAGE_REVIEW_EVENT_KEY, `${total}`)
  const versionName = await getVersionName()
  if (!screenView && total >= IN_APP_REVIEW_ACTIONS_THRESHOLD) {
    const lastReview = await AsyncStorage.getItem(STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS)
    if (!lastReview) {
      await callReviewAPI(versionName)
    } else {
      const days = DateTime.fromMillis(parseInt(lastReview, 10)).diffNow('days').days
      const lastReviewVersion = await AsyncStorage.getItem(STORAGE_LAST_REVIEW_VERSION)

      if (days > IN_APP_REVIEW_INTERVAL_DAYS && lastReviewVersion !== versionName) {
        await callReviewAPI(versionName)
      }
    }
  }
}

const callReviewAPI = async (versionName: string): Promise<void> => {
  logAnalyticsEvent(Events.vama_review_prompt())
  await requestReview()
  await AsyncStorage.setItem(STORAGE_REVIEW_EVENT_KEY, '0')
  await AsyncStorage.setItem(STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS, `${DateTime.now().millisecond}`)
  await AsyncStorage.setItem(STORAGE_LAST_REVIEW_VERSION, versionName)
}

export const resetReviewActionCount = async (): Promise<void> => {
  await AsyncStorage.removeItem(STORAGE_REVIEW_EVENT_KEY)
  await AsyncStorage.removeItem(STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS)
  await AsyncStorage.removeItem(STORAGE_LAST_REVIEW_VERSION)
}
