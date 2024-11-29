import AsyncStorage from '@react-native-async-storage/async-storage'

import { DateTime } from 'luxon'

import { Events } from 'constants/analytics'

import { logAnalyticsEvent } from './analytics'
import { getVersionName } from './deviceData'
import { useGiveFeedback } from './hooks'
import { featureEnabled } from './remoteConfig'
import { requestReview } from './rnReviews'

export const STORAGE_REVIEW_EVENT_KEY = '@review_event'
export const STORAGE_FEEDBACK_EVENT_KEY = '@feedback_event_'
export const STORAGE_LAST_REVIEW_PROMPT_DATE_MILLIS = '@last_review_date'
export const STORAGE_LAST_FEEDBACK_PROMPT_DATE_MILLIS = '@last_feedback_date'
export const STORAGE_LAST_REVIEW_VERSION = '@last_review_version'
export const IN_APP_REVIEW_INTERVAL_DAYS = 122
export const IN_APP_FEEDBACK_INTERVAL_DAYS = 30
export const IN_APP_REVIEW_ACTIONS_THRESHOLD = 7
export const IN_APP_FEEDBACK_ACTIONS_THRESHOLD = 3

export const registerReviewEvent = async (screenView?: boolean, feedbackScreen?: string): Promise<void> => {
  const inAppFeedback = useGiveFeedback()
  if (!featureEnabled('inAppReview') && !featureEnabled('inAppFeedback')) return
  //Checked for feedbackScreen triggers first.
  if (featureEnabled('inAppFeedback') && feedbackScreen) {
    let feedbackKey = STORAGE_FEEDBACK_EVENT_KEY.concat(feedbackScreen)
    const feedbackCount = await AsyncStorage.getItem(STORAGE_FEEDBACK_EVENT_KEY.concat(feedbackScreen))
    const totalFeedback = feedbackCount ? parseInt(feedbackCount, 10) + 1 : 1
    //always increment the count when a feedback screen is registered
    await AsyncStorage.setItem(feedbackKey, `${totalFeedback}`)
    //check if this register would prompt for feedback
    if (totalFeedback >= IN_APP_FEEDBACK_ACTIONS_THRESHOLD) {
      //this date does not need to be feedbackScreen specific based on AC's:
      //'Do not display feedback if user has submitted feedback for any feature within the past 30 days'
      const lastFeedback = await AsyncStorage.getItem(STORAGE_LAST_FEEDBACK_PROMPT_DATE_MILLIS)
      //doesn't prompt for feedback if feedback has been given in past 30 days. If prompt for feedback, return and skip potential in app review
      if (
        (lastFeedback &&
          DateTime.fromMillis(parseInt(lastFeedback, 10)).diffNow('days').days > IN_APP_FEEDBACK_INTERVAL_DAYS) ||
        !lastFeedback
      ) {
        inAppFeedback(feedbackScreen)
        await AsyncStorage.setItem(feedbackKey, '0')
        await AsyncStorage.setItem(STORAGE_LAST_FEEDBACK_PROMPT_DATE_MILLIS, `${DateTime.now().millisecond}`)
        return
      }
    }
  }
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
