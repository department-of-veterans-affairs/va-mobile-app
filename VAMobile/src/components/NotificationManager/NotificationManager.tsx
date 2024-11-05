import React, { Dispatch, FC, SetStateAction, createContext, useContext, useEffect, useState } from 'react'
import { Linking, View } from 'react-native'
import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { useAuthSettings } from 'api/auth'
import { useRegisterDevice } from 'api/notifications'
import { usePersonalInformation } from 'api/personalInformation/getPersonalInformation'
import { Events } from 'constants/analytics'
import { logAnalyticsEvent } from 'utils/analytics'
import getEnv from 'utils/env'

const foregroundNotifications: Array<string> = []
const NOTIFICATION_COMPLETED_KEY = '@store_notification_preference_complete'
const { IS_TEST } = getEnv()
interface NotificationContextType {
  tappedForegroundNotification: boolean
  initialUrl: string
  setTappedForegroundNotification: Dispatch<SetStateAction<boolean>>
  setInitialUrl: Dispatch<SetStateAction<string>>
  requestNotifications: boolean
  setRequestNotifications: Dispatch<SetStateAction<boolean>>
  requestNotificationPreferenceScreen: boolean
  setRequestNotificationPreferenceScreen: Dispatch<SetStateAction<boolean>>
}

const NotificationContext = createContext<NotificationContextType>({
  tappedForegroundNotification: false,
  initialUrl: '',
  setTappedForegroundNotification: () => {},
  setInitialUrl: () => {},
  requestNotifications: false,
  setRequestNotifications: () => {},
  requestNotificationPreferenceScreen: false,
  setRequestNotificationPreferenceScreen: () => {},
})

/**
 * notification manager component to handle all push logic
 */
const NotificationManager: FC = ({ children }) => {
  const { data: userAuthSettings } = useAuthSettings()
  const { data: personalInformation } = usePersonalInformation({ enabled: userAuthSettings?.loggedIn })
  const { mutate: registerDevice } = useRegisterDevice()
  const [tappedForegroundNotification, setTappedForegroundNotification] = useState(false)
  const [initialUrl, setInitialUrl] = useState('')
  const [eventsRegistered, setEventsRegistered] = useState(false)
  const [requestNotifications, setRequestNotifications] = useState(false)
  const [requestNotificationPreferenceScreen, setRequestNotificationPreferenceScreen] = useState(false)

  useEffect(() => {
    const checkRequestNotificationsPreferenceScreen = async () => {
      if (IS_TEST) {
        // In integration tests this will change the behavior and make it inconsistent across runs so return false
        setRequestNotificationPreferenceScreen(false)
        return
      }

      const setNotificationsPreferenceScreenVal = await AsyncStorage.getItem(NOTIFICATION_COMPLETED_KEY)
      console.debug(`checkRequestNotificationPreferenceScreen: is ${!setNotificationsPreferenceScreenVal}`)

      const shouldShowScreen = !setNotificationsPreferenceScreenVal
      setRequestNotificationPreferenceScreen(shouldShowScreen)
    }
    checkRequestNotificationsPreferenceScreen()
  }, [setRequestNotificationPreferenceScreen])

  useEffect(() => {
    const register = () => {
      const registeredNotifications = Notifications.events().registerRemoteNotificationsRegistered((event) => {
        const registerParams = {
          deviceToken: event.deviceToken,
          userID: personalInformation?.id,
        }
        registerDevice(registerParams)
      })
      const failedNotifications = Notifications.events().registerRemoteNotificationsRegistrationFailed(() => {
        const registerParams = {
          deviceToken: undefined,
          userID: undefined,
        }
        registerDevice(registerParams)
      })
      Notifications.events().registerRemoteNotificationsRegistrationDenied(() => {
        registeredNotifications.remove()
        failedNotifications.remove()
      })
      if (userAuthSettings?.firstTimeLogin === false && requestNotifications === true) {
        Notifications.registerRemoteNotifications()
      }
    }

    if (userAuthSettings?.loggedIn && personalInformation?.id) {
      register()
    }
  }, [
    userAuthSettings?.firstTimeLogin,
    userAuthSettings?.loggedIn,
    requestNotifications,
    personalInformation?.id,
    registerDevice,
  ])

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
        if (userAuthSettings?.loggedIn) {
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
      value={{
        tappedForegroundNotification,
        setTappedForegroundNotification,
        initialUrl,
        setInitialUrl,
        requestNotifications,
        setRequestNotifications,
        requestNotificationPreferenceScreen,
        setRequestNotificationPreferenceScreen,
      }}>
      <View style={s}>{children}</View>
    </NotificationContext.Provider>
  )
}

export const useNotificationContext = () => useContext(NotificationContext)

export default NotificationManager
