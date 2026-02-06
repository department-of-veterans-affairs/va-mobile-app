import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

import { DateTime } from 'luxon'

import { Events } from 'constants/analytics'
import store, { RootState } from 'store'
import { ErrorObject } from 'store/api'
import { isErrorObject } from 'utils/common'

export type EventParams = { [key: string]: unknown }

export type Event = {
  name: string
  params?: EventParams
}

export type UserAnalytic = {
  name: string
  value: string | null
}

const LoadTimeRanges = [
  { range: [0, 1000], label: '0 ms - <1000 ms' },
  { range: [1000, 3000], label: '1000 ms - <3000 ms' },
  { range: [3000, 5000], label: '3000 ms - <5000 ms' },
  { range: [5000, 7000], label: '5000 ms - <7000 ms' },
  { range: [7000, 10000], label: '7000 ms - <10000 ms' },
  { range: [10000, 15000], label: '10000 ms - <15000 ms' },
]

export const logAnalyticsEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  const demoMode = store.getState().demo.demoMode

  if (demoMode) {
    console.debug(`(analytics collection disabled in demo mode) triggered analytics event ${name}`, params)
  } else {
    console.debug(`logging analytics event ${name}`, params)
    await analytics().logEvent(name, params)
  }
}

export const setAnalyticsUserProperty = async (property: UserAnalytic): Promise<void> => {
  const { name, value } = property
  const demoMode = store.getState().demo.demoMode

  if (demoMode) {
    console.debug(`(analytics collection disabled in demo mode) setAnalyticsUserProperty ${name} ${value}`)
  } else {
    console.debug(`setAnalyticsUserProperty ${name} ${value}`)
    await analytics().setUserProperty(name, value)
  }
}

export const setAnalyticsUserProperties = async (properties: { [key: string]: string | null }): Promise<void> => {
  await analytics().setUserProperties(properties)
}

export const getAnalyticsTimers = (state: RootState): [number, number, number] => {
  const now = DateTime.now().toMillis()
  const { totalTimeStart, actionStart, loginTimestamp } = state.analytics
  const totalTime = now - totalTimeStart
  const actionTime = now - actionStart
  return [totalTime, actionTime, loginTimestamp]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logNonFatalErrorToFirebase = async (error: any, errorName?: string) => {
  let errorObject: Error = Error()
  let apiErrorObject: ErrorObject | undefined
  let attributes: { [key: string]: string } | undefined

  // if the error is a string
  if (typeof error === 'string') {
    errorObject.message = error
    errorObject.name = error
  } else if (typeof error === 'object' && isErrorObject(error)) {
    // checks if json is in the object for api error
    if ('json' in error && error.json) {
      apiErrorObject = error
      const { text, json, networkError, status } = error
      attributes = {
        text: String(text),
        networkError: String(networkError),
        status: String(status),
      }
      // if the json's errors array has data if not than it creates an error object with the service call status
      if (json.errors?.length > 0) {
        const { detail, title } = json.errors[0]
        errorObject.message = detail
        errorObject.name = title
      } else {
        const errorString = `status: ${status} is network error ${networkError}`
        errorObject.name = errorString
        errorObject.message = errorString
      }
      errorObject.stack = text
      // checks if stack is in the object for non api error
    } else if ('stack' in error) {
      errorObject = error
    }

    logAnalyticsEvent(
      Events.vama_error(
        errorObject.name,
        errorObject.message,
        errorObject.stack,
        apiErrorObject?.status,
        apiErrorObject?.endpoint,
      ),
    )

    if (attributes) {
      await crashlytics().setAttributes(attributes)
    }

    crashlytics().recordError(errorObject, errorName)
  }
}

/**
 * Logs a load time event by mapping the given load time (in milliseconds) to a predefined range.
 * If the load time falls within one of the defined ranges, the corresponding range label is logged.
 * If the load time does not match any range, an "outlier" event is logged instead.
 *
 * @param eventName - the name of the load time event to be logged
 * @param loadTimeMs - the measured load time in milliseconds
 */
export const logLoadTimeEvent = (eventName: string, loadTimeMs: number) => {
  // Map the load time to it's corresponding load time range
  const matchingLoadTimeRange = LoadTimeRanges.find(({ range }) => {
    const [lowerBound, upperBound] = range
    return loadTimeMs >= lowerBound && loadTimeMs < upperBound
  })

  if (matchingLoadTimeRange) {
    logAnalyticsEvent({
      name: eventName,
      params: {
        p1: matchingLoadTimeRange.label,
      },
    })
  } else {
    logAnalyticsEvent(Events.vama_load_time_outlier(eventName, loadTimeMs))
  }
}

/**
 * Logs a screen view event to Firebase Analytics when navigation state changes
 * @param previousRouteName - The name of the previous route
 * @param currentRouteName - The name of the current route
 * @param ignoreScreenView - Whether to skip logging this screen view
 */
export const logScreenViewOnNavChange = async (
  previousRouteName: string,
  currentRouteName?: string,
  ignoreScreenView?: boolean,
): Promise<void> => {
  if (!ignoreScreenView && previousRouteName !== currentRouteName && currentRouteName !== undefined) {
    await analytics().logScreenView({
      screen_name: currentRouteName,
      screen_class: currentRouteName,
    })
  }
}
