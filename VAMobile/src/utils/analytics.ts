import analytics from '@react-native-firebase/analytics'

type Event = {
  name: string
  params?: undefined | { [key: string]: unknown }
}

// todo: make a file full of event classes/objects to reference
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const logAnalyticsEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  await analytics().logEvent(name, params)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setAnalyticsUserProperty = async (name: string, value: string | null): Promise<void> => {
  await analytics().setUserProperty(name, value)
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setAnalyticsUserProperties = async (properties: { [key: string]: string | null }): Promise<void> => {
  await analytics().setUserProperties(properties)
}
