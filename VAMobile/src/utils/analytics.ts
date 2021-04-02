import analytics from '@react-native-firebase/analytics'

type Event = {
  name: string
  params?: undefined | { [key: string]: unknown }
}

const logEvent = async (event: Event): Promise<void> => {
  const { name, params } = event
  await analytics().logEvent(name, params)
}
