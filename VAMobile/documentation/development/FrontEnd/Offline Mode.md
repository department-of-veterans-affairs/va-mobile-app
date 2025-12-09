---
title: Offline mode
---

# Offline Mode

## What is offline mode

Offline mode is a feature which enables the user to continue using the app with as little obstruction as possible in low connectivity environments. Disconnecting from the internet while using the app no longer displays error screens. Instead, cached data will be used to display the users' information if it has already been retrieved in this session. If data is not available for a feature, an informative message will be displayed instead of an error screen.

## How does offline mode work

Enabling offline mode works by utilizing two libraries, NetInfo to detect the network status of the device and react-query to store and fetch the data in the local cache. When the device disconnects from the network, NetInfo will listen for that change, display an offline mode banner app wide, and set the status for react-query to handle how data should be fetched. When in offline mode, react query will not make API requests. Instead, it will check the local cache for the query and provide that to the query caller. If no data is available in the cache for a query, an empty result is returned.
On initial load of the App component, an event listener is set up to set the connection status for react-query using NetInfo. Offline mode is currently behind a feature flag and can be toggled by `offlineMode `in the remote config screen of the developer settings. After offline mode has been enabled in the remote config, restarting the app is required for it to function properly.

## How do I add offline mode to my feature?
For examples of the following steps, look at the Appointments feature code where this is fully built out.
1. For any query that a feature uses to fetch data, replace the use of tanstack useQuery with useQuery from the queryClient.ts file. This will enable saving of the last updated timestamp.
2. In that useQuery add the retry option. You can use offlineRetry as basic functionality. This helps in the case that the network fails mid-request. Instead of throwing an error to be displayed, we simply retry now that we are offline, causing the query to go to the cache instead of making a second request.
3. To add the Last Updated Timestamp to the UI, simply provide the lastUpdatedDate that is now returned from your offline enabled query and pass it to FeatureLandingAndChildTemplate as dataUpdatedAt
4. The Offline Banner is a global piece of UI and is already enabled everywhere.
5. When offline and there is no data to display from the cache, use the ContentUnavailableCard where your data would be to display a message to the user that they are offline and do not have access to the feature.
6. Track offline mode usage for your feature with analytics by using useOfflineEventQueue with the ScreenIDTypesConstants that relates to the screen your feature is on. When the app is offline, other analytic events will not be sent since we aren't queuing all the events, just the offline mode on/off.
7. If the feature has ui that performs an action that would require a network connection, this can be handled by short-circuiting the action and calling showOfflineSnackbar instead. To check the network status when the action is called, use useAppIsOnline and check if the connectionStatus is currently disconnected before performing your action.
8. Ensure any interactions with offline mode are behind the offlineMode feature flag

## Debugging                                           

Developers can enable offline mode without disconnecting from the network by navigating to the developer screen and enabling the Offline Debug toggle. This will add a toggle to the header representing the connection status. On for online, off for offline. This is helpful for testing ui, accessibility and basic functionality, but the features should still be tested by actually disabling the connection before features are pushed.
To clear the offline cache, go to the developer settings screen and press 'Reset offline storage'. This will reset all queries to empty states. This is helpful for testing features that use data that loads immediately on app launch that is difficult to test with no data otherwise.
When using a physical android device connected to Android Studio, the command `adb shell svc wifi enable|disable` can be used to enable or disable Wi-Fi. This is useful for simulating a mid-request disconnect as well as testing screen reader behavior without leaving the app to disconnect.

## Testing

* To enable offline mode in tests, pass the isOnline flag to the render function from testUtils. This will set the connection status for both react query and net info while tests are running. The default value of isOnline is true
* NetInfo functionality has been fully mocked in jest/netinfoMock.ts