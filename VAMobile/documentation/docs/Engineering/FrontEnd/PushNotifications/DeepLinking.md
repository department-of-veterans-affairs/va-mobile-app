---
title: Deep Linking
sidebar_position: 1
---

# Deep Linking

## Overview

Deep links in the app are handled by the React Navigation library. The linking config handles everything from mapping the screens and links to updating state when necessary.

## Setting up push notifications

A prerequisite for adding deep linking for a feature's push notification is to have push notifications setup for that feature. An architectural overview of how push notifications work in the app and information on how to add them for a feature can be found [here](http://localhost:3000/va-mobile-app/docs/Engineering/BackEnd/Features/PushNotifications)

## Adding a new deep link

You can map your notification to a specific screen by updating the `config` property in the React Native linking options. The structure of the `screens` object is based on the navigation structure of the app. The key represents the name of the screen in the navigation stack, while the value represents the URI that is being mapped to that screen. For instance, in the config:

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

You'll notice the entry for the screen `ViewMessageScreen` is nested under other screens like `HealTab` and `Tabs`. This reflects the structure of the app's navigation stack. Starting from the [root navigator](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/App.tsx#L313-L334), you can trace the stack by viewing the `component` prop of the route in the stack until you arrive at the screen you want. In this example the `Tabs` route is mapped to the `AppTabs` component, which is where most of the screens in the app fall under. In the [AppTabs](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/App.tsx#L279-L292) component, you'll see a navigation stack containing the `HealthTab` route which maps to the `HealthScreen` screen. In the HealthScreen component, you'll see a navigation stack with all the health screens, and the `ViewMessageScreen` route which maps to the `ViewMessageScreen` component is present. These steps can be followed when trying to figure out how the structure of your deep link in the linking config should look. 

The URI endpoint `messages/:messageID` is being mapped to the `ViewMessageScreen` screen, where the `:messageID` is a parameter that is expected to be in the URI. The parameter will be passed to the screen's props. The name of the parameter in the config should match the name of the prop in the screen. More information on passing parameters can be found in the [React Navigation documentation](https://reactnavigation.org/docs/configuring-links#passing-params)

### Handling back navigation

The steps above will map all links starting with `vamobile://messages/:messageID` to the appropriate screen, which is what we want. Depending on how nested the screen is, one issue you may run into is navigating backwards. Navigating back on screens opened via a deep link will take you to the home screen. This is because React Navigation isn't able to automatically generate the correct navigation state when a deep link is opened. The navigation state will need to be manually generated to ensure navigating back after opening a deep link takes the user to the correct screen.

In the linking config, the [getStateFromPath](https://github.com/department-of-veterans-affairs/va-mobile-app/blob/8daf0536ebbf801de0ed63e0b2af9385d54b1bc1/VAMobile/src/constants/linking.tsx#L27-L49) function can be used for manually setting the navigation state from the path of the deep link. Logic added here shouldn't conflict logic for other paths. The generated navigation state for the example above looks like this:

```tsx
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
```
More information on navigation state can be found in the [React Navigation documentation](https://reactnavigation.org/docs/navigation-state).
