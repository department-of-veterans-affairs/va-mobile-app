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
export const logNonFatalErrorToFirebase = async (error: any, errorName?: string) => {
  let errorObject: Error = Error()
  let attributes: { [key: string]: string } | undefined

  if (typeof error === 'string') {
    errorObject.message = error
    errorObject.name = error
  } else if (typeof error === 'object' && isErrorObject(error)) {
    // if json property is present, this is an API error
    if ('json' in error && error.json) {
      const { text, json, networkError, status, headers } = error
      attributes = {
        text: String(text),
        networkError: String(networkError),
        status: String(status),
        headers: String(headers),
      }
      // if json errors array has data, use it. otherwise create error object with API call status
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
    } else if ('stack' in error) {
      // non-api error contains stack property. pass it along
      errorObject = error
    }

    // record additional info about the error if we have it
    if (attributes) {
      await crashlytics().setAttributes(attributes)
    }

    return crashlytics().recordError(errorObject, errorName)
  }
}
