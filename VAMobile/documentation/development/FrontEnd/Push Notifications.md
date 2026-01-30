---
title: Push notifications
---

## Overview

Push notifications should be used only when they provide timely or important information to Veterans. They are most appropriate for reminders about appointments, prescription refills, or requests for claim evidence. Routine updates that are not urgent should remain in the app.

Notification frequency should be managed carefully. Teams should coordinate to avoid sending multiple messages in a short period, and when there are several updates, they should be combined into a single notification where possible. Both Apple and Android provide standards for grouping notifications, which should be followed.

Content should be clear, concise, and written in plain language. Veterans should be able to dismiss notifications at any time. If a notification is tapped, it should take the user directly to the appropriate location in the app. Notifications should also expire automatically after a set period.

Success should be measured by tracking how many Veterans keep notifications enabled, how often they interact with them, and whether the intended action is completed. These insights can guide improvements to timing, frequency, and message design. Some helpful metrics to track include: 
- delivery rate (percentage of messages that reach devices)
- open rate (percentage of users who open after receiving)
- conversion rate (percentage of users who complete the intended action)
- opt-out rate (percentage of users who disable the notification)

## Setting up push notifications

Deep links in the app are handled by the React Navigation library. The React Navigation linking configuration handles mapping links to the appropriate screens, and updating the navigation state when necessary.

A prerequisite for adding deep linking support for a feature's push notification is to have push notifications setup for that feature. An architectural overview of how push notifications work in the app and information on how to add them for a feature can be found [in push notification documentation](../BackEnd/Features/PushNotifications.md).

In order for deep linking to work for your push notification, the `url` field must be present in the push template. The URL should be prefixed with `vamobile://` and followed by the path of the deep link you want to add, e.g. `vamobile://messages/%MSG_ID%`. In this example, the path of the deep link is prefixed with `vamobile://`, starts with `messages`, and is followed by the `MSG_ID` parameter, which is a field that will be populated from the API call that triggers the push notification. This will result in push notifications returning a payload that looks something like:

``` json
{
  ...
  "url": "vamobile://messages/1234"
}
```

## Adding a new deep link

To map your push notification to a specific screen, you'll need to update the `config` object in the [React Navigation linking configuration](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/constants/linking.tsx). `config` contains a `screens` object, which is based on the navigation structure of the app. Within that object, the key represents the route name of the screen in the navigation stack, and the value represents the URL that should be mapped to that screen. Route names in `config` can also nest other `screens` objects for child routes. For reference, the configuration can look something like this:

```tsx
config: {
  screens: {
    Tabs: {
      screens: {
        HealthTab: {
          screens: {
            ViewMessageScreen: 'messages/:messageID',
          },
        },
      },
    },
  },
}
```

You'll notice the entry for the screen `ViewMessageScreen` is nested under other screens like `HealthTab` and `Tabs`. This reflects the structure of the app's navigation stack. Starting from the [root navigator](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/App.tsx#L313-L334), you can trace the stack by viewing the `component` prop of the route in the stack until you arrive at the screen you want. Using the example above, the [Tabs](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/App.tsx#L326) route is mapped to the `AppTabs` component, which is where most of the screens in the app fall under. In the [AppTabs](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/App.tsx#L279-L292) component, you'll see a navigation stack containing the `HealthTab` route, which maps to the `HealthScreen` screen. In the `HealthScreen` component, you'll see a [navigation stack](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/cc92f2f99be1afc2fb3712a858f3351f964b1905/VAMobile/src/screens/HealthScreen/HealthScreen.tsx#L151-L174) containing all the health screens. From that list, you'll find the `ViewMessageScreen` route, which finally maps to the `ViewMessageScreen` component. Following these steps can make it easier to determine the structure of your deep link when updating the linking configuration.

### Passing props to screens

From the example above, the URI endpoint `messages/:messageID` is being mapped to the `ViewMessageScreen` screen, where `:messageID` is a parameter that is expected to be in the URI. That parameter will be passed to the screen's props. The name of the parameter in the URL must match the name of the prop in the screen's component in order for it to be passed to the component, so in this example, the `ViewMessageScreen` component has a prop named `messageID` as well. More information on passing parameters can be found in the [React Navigation documentation](https://reactnavigation.org/docs/configuring-links#passing-params).

## Handling back navigation

 Once you've added your deep link to the linking configuration, depending on how nested the screen is in the app, one issue you may run into is navigating backwards. Navigating back from screens opened via a deep link will typically go back to the home screen. This is because React Navigation isn't able to automatically generate the correct navigation state when a deep link is opened. The navigation state will need to be manually generated to ensure navigating back after opening a deep link takes the user to the correct screen.

In the linking configuration, the [getStateFromPath](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/constants/linking.tsx#L27-L49) function can be used for manually setting the navigation state based on the path of the opened deep link. Logic added here shouldn't conflict with logic for other deep links. The generated navigation state for `ViewMessageScreen` from the previous examples looks like this:

```tsx
{
  routes: [
    {
      name: 'Tabs',
      state: {
        routes: [
          {
            name: 'HealthTab',
            state: {
              routes: [{ name: 'Health' }, { name: 'SecureMessaging' }, { name: 'ViewMessageScreen', params: { messageID: pathParts[1] } }],
            },
          },
        ],
      },
    },
  ],
}
```

The state should match the behavior you'd see if you were manually navigating from the home screen to the desired screen. The navigation state should be returned by the function if the `path` parameter matches the pattern specified in the `config` object. This will ensure that navigating back from the screen opened by a push notification produces expected behavior.

More information on navigation state can be found in the [React Navigation documentation](https://reactnavigation.org/docs/navigation-state).

## Testing deep links

Once you've configured deep linking for your push notification, you'll be able to test it by triggering push notifications remotely from the responsible service. The VANotify API can also be used to send push notifications to a device, but this requires an API key that will need to be provided by the VANotify team.

1. Contact VANotify on Slack [#va-notify-public](https://dsva.slack.com/archives/C010R6AUPHT) to receive an API key to start testing. Note that this API key will be sent to your VA email.
2. Download the [postman collection](https://github.com/department-of-veterans-affairs/notification-api/blob/main/documents/postman/README.md) provided by VANotify.
   1. The `staging-simplified.postman_environment.json` should be imported to your Postman `Environments`. The `serviceId` and `api-key` should be included in the email.
    ![Postman Environment](/img/pushNotifications/push_postman_env.png)
   2. The `notification-api-simplified.postman_collection.json` file should be imported to your Postman `Collections`. Ensure that the correct environment is chosen for the collection.
    ![Postman Collection](/img/pushNotifications/push_postman_collection.png)
3. The main endpoint that will be used to send push notifications will be `/v2/notifications/push`. This endpoint uses `{{icn}}`, which corresponds to a staging user that the push notification will be sent to and a `{{vetext-template-id}}`, which is the type of push notification that is sent (ex. Secure messaging or Appointment). These values can be populated in the environment file.
4. Hit `Send` on Postman to send a push notification. Note that a notification will be sent to everyone who is logged into that user.  
:::note 
Remote push notifications will only work on a physical device with a non-development build installed, so you'll need to run an [on demand build](../QA/QABuilds.md#on-demand-builds) for your branch as well as log in with a staging user.
:::

### Local testing

If you're not able to test your deep link via remote push notifications, or would like a quicker way of testing, you can test your deep link locally with either [uri-scheme](https://github.com/expo/expo-cli/tree/main/packages/uri-scheme) or [Detox](../../gettingStarted/SetUp/DevelopmentSetUpProcess/QA resources/index.md#detox-our-ui-automation-tool).

#### uri-scheme

This is a CLI tool used for testing native URI schemes on both iOS and Android. This approach will work with a virtual device. To test your deep link, you can run the following command in your terminal:

```
npx uri-scheme open "{THE_FULL_URL}" --{DEVICE_PLATFORM}
```

This will launch the app with the provided URL, similar to how a push notification with deep linking configured would. Using the example from earlier, running this for the iOS simulator would look something like:

```
npx uri-scheme open "vamobile://messages/1234" --ios
```

#### Xcode command-line tools

For testing on iOS, you can simulate a push notification using Xcode's command-line tools. First, you will need to define a [remote notification payload](https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html) in a `payload.json` file:

```json
{
  "url": "vamobile://messages/1234",
  "aps": {
    "alert": {
      "title": "VA Mobile App",
      "body": "Notification body text"
    }
  }
}
```

Then, you can use `xcrun` to send a push notification to the iOS simulator by running the following command in your terminal:

```
xcrun simctl push booted gov.va.vamobileapp payload.json
```

A push notification will appear in the simulator with the specified title and body text. When tapped, it will open the deep link provided in the url field.

#### Detox

You can also use our automated UI testing tool Detox to simulate push notifications on a virtual device. Detox supports [mocking push notifications](https://wix.github.io/Detox/docs/guide/mocking-user-notifications/), which provides a more complete view of how the app will behave when a deep link is opened from a push notification. Since Detox is already used in our repository, all you'll need to do is create a new test for your push notification, and run it locally. [View an example of a Detox test for a push notification](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/develop/VAMobile/e2e/tests/PushNotifications.e2e.ts).
