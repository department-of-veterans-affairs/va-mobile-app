# Push notifications testing
To work with push notifications, pull the /push branch.

Start up a device for android or iOS. You should use a real device and not a sim since iOS does not do push to sim.

You will need to start the app once with this build to register the device. Then you can start sending notifications.

## iOS
IOS testing requires a signing certificate. You will need to DL the app’s push certificate from [Your Developer Account](https://developer.apple.com/account/resources/certificates/list)
1. Click on this certificate:
![](Push%20notifications%20testing/D1F98B4E-A8FE-49D3-A79D-E71D3229D513.png)

2. Then hit the download button and save the file
3. Then go to Applications > Keychain Access.
4. Find the _Apple Push Services: us.adhocteam.alpha.vamobile_ certificate. Right click and select Export.
5. You will need to create a .pem from the .p12 file:
```shell
openssl pkcs12 -nodes -clcerts -in Certificates.p12 -out Certificates.pem
```

Once you have that, run this curl to send a test alert. The app needs to be in the background in order to get the system alert.

```shell
curl -v \
  -d '{"aps":{"alert": {"title": "Test Notification", "body": "Just a test"},"sound":"default"}, "data": {"appt":"34.4444.4444.4444"}' \
  -H "apns-topic:us.adhocteam.alpha.vamobile" \
  -H "apns-expiration: 1" \
  -H "apns-priority: 10" \
  --http2 \
  --cert <.pem location> \
  https://api.development.push.apple.com/3/device/e250bc12b763e0e99da56beefc78e4c3c3df7084ee5aeb32bce50d86e2d2fb58
```

In-App notification payload: 
```javascript
{ payload: 
   { thread: '',
     data: 'vamobile://appointments/34.4444.4444.4444',
     aps: 
      { sound: 'default',
        alert: 
         { title: 'VA Secure Message',
           body: 'You have a new Secure Message from VA.' 
         } 
      },
     date: '2021-03-04T11:17:29.072-06:00',
     title: 'VA Secure Message',
     category: '',
     identifier: '6CAB9F00-2DD2-46C1-BCBF-D0D5A3131B2F',
     body: 'You have a new Secure Message from VA.' 
    },
  identifier: '6CAB9F00-2DD2-46C1-BCBF-D0D5A3131B2F' }
```

### IOS VEText message payload
```json
"aps": {
      "alert": {
        "title": "VA Appointment Reminder",
        "body": "You have an upcoming VA appontment."
      },
      "sound": "default"
    },
    "data": {
      "appt": "###.###.######.###"
    }
  }
```


## Android
Go to [The Firebase Console](https://console.firebase.google.com/u/0/project/va-mobile/overview). Select Engage > Cloud Messaging from the menu.

You should see a bunch of test messages. 
1. Hover over any of the test notifications and open the overflow menu. 
2. Select Duplicate notification
3. Fill out your test payloads and select next
4. Make sure your target is _us.adhocteam.alpha.vamobile_ with the android icon.
5. Complete the rest of the options as needed and click review
6. Click publish on the modal that pops up.

The app needs to be in the background in order to get the system alert.

In-App Notification payload: 
```javascript
{ payload: 
   { 'google.message_id': '0:1614879564140034%5f98ccc55f98ccc5',
     from: '757307945667',
     'gcm.n.e': '1',
     'google.c.a.udt': '0',
     'gcm.notification.title': 'VA Secure Message',
     'gcm.notification.e': '1',
     collapse_key: 'us.adhocteam.alpha.vamobile',
     'google.delivered_priority': 'high',
     'google.original_priority': 'high',
     'gcm.notification.tag': 'campaign_collapse_key_3748901012187610988',
     'google.c.a.c_id': '3748901012187610988',
     'google.sent_time': 1614879563796,
     'google.c.a.ts': '1614879563',
     'google.c.a.e': '1',
     'gcm.notification.body': 'You have a new Secure Message from VA.',
     'google.c.a.c_l': 'VA Secure Message',
     'google.c.sender.id': '757307945667',
     'google.ttl': 3600 
    },
  identifier: '0:1614879564140034%5f98ccc55f98ccc5' 
}
```

### Optional method
[Send your test FCM push notification with cURL - Mestwin Blog](https://blog.mestwin.net/send-your-test-fcm-push-notification-quickly-with-curl/)
```shell
curl -X POST -H "Authorization: Bearer TOKEN" -H "Content-Type: application/json" -d '{
  "message":{
"token":"DEVICE FCM TOKEN",
    "notification":{
      "title":"VA Secure Message",
      "body":"You have a new Secure Message from VA."
    },
    "data": {
	"appt":"301.55654.544"
    }
  }
}' https://fcm.googleapis.com/v1/projects/va-mobile/messages:send
```

### Android VETEXT message payload
```json
"message" {
    "token": "DEVICE-TOKEN",
    "notification": {
    "title": "VA Appointment Reminder",
    "body": "You have an upcoming VA appontment."
  },
  "data": {
    "appt": "###.###.######.###"
  }
}
```
