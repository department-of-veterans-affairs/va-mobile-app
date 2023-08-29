---
title: Deep Linking
---

# Deep Linking

## Overview

Deep links in the app are handled by the React Navigation library. The React Navigation linking configuration handles mapping links to the appropriate screens, and updating the navigation state when necessary.

## Setting up push notifications

A prerequisite for adding deep linking support for a feature's push notification is to have push notifications setup for that feature. An architectural overview of how push notifications work in the app and information on how to add them for a feature can be found [here](../../BackEnd/Features/PushNotifications.md).

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
