import { DateTime } from 'luxon'
import { StoreState } from 'store'
import analytics from '@react-native-firebase/analytics'

export type Event = {
  name: string
  params?: undefined | { [key: string]: unknown }
}

export type UserAnalytic = {
  name: string
  value: string | null
}

export const logAnalyticsEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  console.debug(`logging analytics event ${name}`)
  await analytics().logEvent(name, params)
}

export const setAnalyticsUserProperty = async (property: UserAnalytic): Promise<void> => {
  const { name, value } = property
  console.debug(`setAnalyticsUserProperty ${name} ${value}`)
  await analytics().setUserProperty(name, value)
}

export const setAnalyticsUserProperties = async (properties: { [key: string]: string | null }): Promise<void> => {
  await analytics().setUserProperties(properties)
}

export const getAnalyticsTimers = (state: StoreState): [number, number, number] => {
  const now = DateTime.now().millisecond
  const { totalTimeStart, actionStart, loginTimestamp } = state.analytics
  const totalTime = now - totalTimeStart
  const actionTime = now - actionStart
  return [totalTime, actionTime, loginTimestamp]
}
