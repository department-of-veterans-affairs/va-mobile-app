import analytics from '@react-native-firebase/analytics'

type Event = {
  name: string
  params?: undefined | { [key: string]: unknown }
}

// todo: make a file full of event classes/objects to reference

const logAnalyticsEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  await analytics().logEvent(name, params)
}

const setAnalyticsUserProperty = async (name: string, value: string | null): Promise<void> => {
  await analytics().setUserProperty(name, value)
}

const setAnalyticsUserProperties = async (properties: { [key: string]: string | null }): Promise<void> => {
  await analytics().setUserProperties(properties)
}
