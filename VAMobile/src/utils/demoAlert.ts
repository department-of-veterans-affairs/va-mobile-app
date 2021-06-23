import { Alert } from 'react-native'
import getEnv from 'utils/env'
const { DEMO_PASSWORD } = getEnv()
export const demoAlert = (setDemo: () => void): void => {
  Alert.prompt('Enter Password', 'Please enter the demo mode password', [
    {
      text: 'Cancel',
      style: 'cancel',
    },
    {
      text: 'Demo',
      onPress: (value?: string | null) => {
        if (value === DEMO_PASSWORD) {
          setDemo()
        } else {
          Alert.alert('Invalid Code', 'Try Again')
        }
      },
      style: 'default',
    },
  ])
}
