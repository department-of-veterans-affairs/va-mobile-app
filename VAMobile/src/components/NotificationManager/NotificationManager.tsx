import { AuthState } from 'store/slices'
import { Events } from 'constants/analytics'
import { Linking, View } from 'react-native'
import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'
import { RootState } from 'store'
import { dispatchSetInitialUrl, dispatchSetTappedForegroundNotification, registerDevice } from 'store/slices/notificationSlice'
import { logAnalyticsEvent } from 'utils/analytics'
import { useAppDispatch } from 'utils/hooks'
import { useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

const foregroundNotifications: Array<string> = []

/**
 * notification manager component to handle all push logic
 */
const NotificationManager: FC = ({ children }) => {
  const { loggedIn } = useSelector<RootState, AuthState>((state) => state.auth)
  const dispatch = useAppDispatch()
  const [eventsRegistered, setEventsRegistered] = useState(false)
  useEffect(() => {
    const register = () => {
      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        console.debug('Device Token Received', event.deviceToken)
        dispatch(registerDevice(event.deviceToken))
      })
      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
        //TODO: Log this error in crashlytics?
        console.error(event)
        dispatch(registerDevice())
      })
      Notifications.registerRemoteNotifications()
    }

    if (loggedIn) {
      register()
    }
  }, [dispatch, loggedIn])

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
        dispatch(dispatchSetTappedForegroundNotification())
      }

      // Open deep link from the notification when present. If the user is
      // not logged in, store the link so it can be opened after authentication.
      if (notification.payload.url) {
        if (loggedIn) {
          Linking.openURL(notification.payload.url)
        } else {
          dispatch(dispatchSetInitialUrl(notification.payload.url))
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
          dispatch(dispatchSetInitialUrl(notification.payload.url))
        }
      })
      .catch((err) => console.error('getInitialNotification() failed', err))
  }

  if (!eventsRegistered) {
    registerNotificationEvents()
    setEventsRegistered(true)
  }

  const s = { flex: 1 }
  return <View style={s}>{children}</View>
}

export default NotificationManager
