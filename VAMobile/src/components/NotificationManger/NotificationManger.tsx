import { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'
import { View } from 'react-native'
import React, { FC } from 'react'

const NotificationManger: FC = ({ children }) => {
  const registerDevice = () => {
    Notifications.events().registerRemoteNotificationsRegistered((event) => {
      // TODO: Send the token to my server so it could send back push notifications...
      console.log('Device Token Received', event.deviceToken)
    })
    Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
      console.error(event)
    })

    Notifications.registerRemoteNotifications()
  }

  const registerNotificationEvents = () => {
    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log('Notification Received - Foreground', notification)
      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
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

  return <View style={{ flex: 1 }}>{children}</View>
}

export default NotificationManger
