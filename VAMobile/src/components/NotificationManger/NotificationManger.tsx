import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'
import { View } from 'react-native'
import { isIOS } from '../../utils/platform'
import { updateAppointmentBadge } from 'store'
import { useDispatch } from 'react-redux'
import React, { FC } from 'react'

const NotificationManger: FC = ({ children }) => {
  const dispatch = useDispatch()
  const registerDevice = () => {
    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken)
      // dispatch(updateDeviceToken(event.deviceToken))
    })
    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event)
    })

    Notifications.registerRemoteNotifications()
  }

  const registerNotificationEvents = () => {
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification Received - Foreground', notification)
      let title, body
      if (isIOS()) {
        title = notification.payload.title
        body = notification.payload.body
      } else {
        title = notification.payload['gcm.notification.title']
        body = notification.payload['gcm.notification.body']
      }
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      console.log(`${title}: ${body}`)
      // Alert.alert(title, body)
      dispatch(updateAppointmentBadge(true))
      completion({ alert: false, sound: false, badge: false })
    })

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log('Notification opened by device user', notification)
      console.log(`Notification opened with an action identifier: ${notification.identifier}`)
      completion()
    })

    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {
      console.log('Notification Received - Background', notification)

      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
      completion(NotificationBackgroundFetchResult.NEW_DATA)
    })

    Notifications.getInitialNotification()
      .then((notification) => {
        console.log('Initial notification was:', notification || 'N/A')
      })
      .catch((err) => console.error('getInitialNotification() failed', err))
  }

  registerDevice()
  registerNotificationEvents()

  const s = { flex: 1 }
  return <View style={s}>{children}</View>
}

export default NotificationManger
