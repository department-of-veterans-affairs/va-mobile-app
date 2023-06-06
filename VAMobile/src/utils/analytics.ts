import { DateTime } from 'luxon'
import { RootState } from 'store'
import { isErrorObject } from './common'
import analytics from '@react-native-firebase/analytics'
import crashlytics from '@react-native-firebase/crashlytics'

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
  console.log('in logNonFatalErrorToFirebase')
  let errorObject: Error = Error()

  // if the error is a string
  if (typeof error === 'string') {
    console.log('error is a string:', error)
    errorObject.message = error
    errorObject.name = error
  } else if (typeof error === 'object' && isErrorObject(error)) {
    console.log('error is an errorObject: ', error)
    // checks if json is in the object for api error
    if ('json' in error && error.json) {
      console.log('errorObject contains json property: ', error.json)
      const { text, json, networkError, status } = error
      // if the json's errors array has data if not than it creates an error object with the service call status
      if (json.errors?.length > 0) {
        console.log('json.errors length > 0: ', json.errors)
        const { detail, title } = json.errors[0]
        errorObject.message = detail
        errorObject.name = title
      } else {
        console.log('json.errors length 0 or not present: ', json.errors)
        const errorString = `status: ${status} is network error ${networkError}`
        console.log('errorString is ', errorString)
        errorObject.name = errorString
        errorObject.message = errorString
      }
      errorObject.stack = text
      // checks if stack is in the object for non api error
    } else if ('stack' in error) {
      console.log('errorObject contains stack property: ', error.stack)
      errorObject = error
    }

    console.log('calling crashlytics().recordError() with ', { errorObject, errorName })
    crashlytics().recordError(errorObject, errorName)
  }

  console.log('error is not a string or errorObject. returning without recording it: ', error)
}
