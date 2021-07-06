import { AuthState, StoreState, registerDevice } from 'store'
import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import React, { FC, useEffect, useState } from 'react'

/**
 * notification manager component to handle all push logic
 */
const NotificationManger: FC = ({ children }) => {
  const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)
  const dispatch = useDispatch()
  const [eventsRegistered, setEventsRegistered] = useState(false)
  useEffect(() => {
    const register = () => {
      Notifications.events().registerRemoteNotificationsRegistered((event) => {
        console.log('Device Token Received', event.deviceToken)
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
    console.log('REGISTER EVENTS')
    // Register callbacks for notifications that happen when the app is in the foreground
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      //TODO: UX creates foreground notification story/stories
      console.log('Notification Received - Foreground', notification)
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion({ alert: false, sound: false, badge: false })
    })

    // Register callback for opened notifications
    Notifications.events().registerNotificationOpened((notification, completion) => {
      /** this should be logged in firebase automatically. Anything here should be actions the app takes when it
       * opens like deep linking, etc
       */
      console.log('Notification opened by device user', notification)
      console.log(`Notification opened with an action identifier: ${notification.identifier}`)
      completion()
    })

    // Register callbacks for notifications that happen when the app is in the background
    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log('Notification Received - Background', notification)

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion(NotificationBackgroundFetchResult.NEW_DATA)
    })

    // Callback in case there is need to do something with initial notification before it goes to system tray
    Notifications.getInitialNotification()
      .then((notification) => {
        console.log('Initial notification was:', notification || 'N/A')
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

export default NotificationManger
