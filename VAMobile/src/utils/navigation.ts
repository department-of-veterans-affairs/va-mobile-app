import { useNavigation } from '@react-navigation/native'
export type OnPressHandler = () => void

/**
 * Navigation hook to use in onPress events.
 *
 * routeName - the string value for Navigation Route to open
 *
 * @returns useRoutNavigation function to use as a closure for onPress events
 */
export default function useRouteNavigation(): (routeName: string) => OnPressHandler {
  const navigation = useNavigation()
  return (routeName: string) => (): void => {
    navigation.navigate(routeName)
  }
}
