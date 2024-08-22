import React, { Dispatch, FC, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { Linking, View } from 'react-native'
import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'
import { useSelector } from 'react-redux'

import { useRegisterDevice } from 'api/notifications'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { Events } from 'constants/analytics'
import { RootState } from 'store'
import { AuthState } from 'store/slices'
import { logAnalyticsEvent } from 'utils/analytics'

const foregroundNotifications: Array<string> = []

interface NotificationContextType {
  tappedForegroundNotification: boolean
  initialUrl: string
  setTappedForegroundNotification: Dispatch<SetStateAction<boolean>>
  setInitialUrl: Dispatch<SetStateAction<string>>
}

const NotificationContext = createContext<NotificationContextType>({
  tappedForegroundNotification: false,
  initialUrl: '',
  setTappedForegroundNotification: () => {},
  setInitialUrl: () => {},
})

/**
 * notification manager component to handle all push logic
 */
const NotificationManager: FC = ({ children }) => {
  const { loggedIn } = useSelector<RootState, AuthState>((state) => state.auth)
  const { data: personalInformation } = usePersonalInformation({ enabled: loggedIn })
  const { mutate: registerDevice } = useRegisterDevice()
  const [tappedForegroundNotification, setTappedForegroundNotification] = useState(false)
  const [initialUrl, setInitialUrl] = useState('')
  const [eventsRegistered, setEventsRegistered] = useState(false)

  useEffect(() => {
    const register = () => {
      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        const registerParams = {
          deviceToken: event.deviceToken,
          userID: personalInformation?.id,
        }
        registerDevice(registerParams)
      })
      Notifications.events().registerRemoteNotificationsRegistrationFailed(() => {
        const registerParams = {
          deviceToken: undefined,
          userID: undefined,
        }
        registerDevice(registerParams)
      })
      Notifications.registerRemoteNotifications()
    }

    if (loggedIn) {
      register()
    }
  }, [loggedIn, personalInformation?.id, registerDevice])

  const registerNotificationEvents = () => {
    // Register callbacks for notifications that happen when the app is in the foreground
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.debug('Notification Received - Foreground', notification)
      foregroundNotifications.push(notification.identifier)
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: true, sound: true, badge: true })
    })

    // Register callback for opened notifications
    Notifications.events().registerNotificationOpened((notification, completion) => {
      /** this should be logged in firebase automatically. Anything here should be actions the app takes when it
       * opens like deep linking, etc
       */
      logAnalyticsEvent(Events.vama_notification_click(notification.payload.url))
      if (foregroundNotifications.includes(notification.identifier)) {
        setTappedForegroundNotification(true)
      }

      // Open deep link from the notification when present. If the user is
      // not logged in, store the link so it can be opened after authentication.
      if (notification.payload.url) {
        if (loggedIn) {
          Linking.openURL(notification.payload.url)
        } else {
          setInitialUrl(notification.payload.url)
        }
      }
      console.debug('Notification opened by device user', notification)
      console.debug(`Notification opened with an action identifier: ${notification.identifier}`)
      completion()
    })

    // Register callbacks for notifications that happen when the app is in the background
    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.debug('Notification Received - Background', notification)
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion(NotificationBackgroundFetchResult.NEW_DATA)
    })

    // Callback in case there is need to do something with initial notification before it goes to system tray
    Notifications.getInitialNotification()
      .then((notification) => {
        logAnalyticsEvent(Events.vama_notification_click(notification?.payload.url))
        console.debug('Initial notification was:', notification || 'N/A')

        if (notification?.payload.url) {
          setInitialUrl(notification.payload.url)
        }
      })
      .catch((err) => console.error('getInitialNotification() failed', err))
  }

  if (!eventsRegistered) {
    registerNotificationEvents()
    setEventsRegistered(true)
  }

  const s = { flex: 1 }
  return (
    <NotificationContext.Provider
      value={{ tappedForegroundNotification, setTappedForegroundNotification, initialUrl, setInitialUrl }}>
      <View style={s}>{children}</View>
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)

export default NotificationManager
