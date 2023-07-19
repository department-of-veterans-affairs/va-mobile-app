import { DateTime } from 'luxon'
import { RootState } from 'store'
import { isErrorObject } from './common'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

import { ErrorObject } from 'store/api'
import { Events } from 'constants/analytics'

export type EventParams = { [key: string]: unknown }

export type Event = {
  name: string
  params?: EventParams
}

export type UserAnalytic = {
  name: string
  value: string | null
}

export const logAnalyticsEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  console.debug(`logging analytics event ${name}`, params)
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

export const getAnalyticsTimers = (state: RootState): [number, number, number] => {
  const now = DateTime.now().toMillis()
  const { totalTimeStart, actionStart, loginTimestamp } = state.analytics
  const totalTime = now - totalTimeStart
  const actionTime = now - actionStart
  return [totalTime, actionTime, loginTimestamp]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const logNonFatalErrorToFirebase = (error: any, errorName?: string) => {
  let errorObject: Error = Error()
  let apiErrorObject: ErrorObject | undefined

  // if the error is a string
  if (typeof error === 'string') {
    errorObject.message = error
    errorObject.name = error
  } else if (typeof error === 'object' && isErrorObject(error)) {
    // checks if json is in the object for api error
    if ('json' in error && error.json) {
      apiErrorObject = error
      const { text, json, networkError, status } = error
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

    logAnalyticsEvent(Events.vama_error(errorObject.name, errorObject.message, errorObject.stack, apiErrorObject?.status, apiErrorObject?.endpoint))
    crashlytics().recordError(errorObject, errorName)
  }
}
