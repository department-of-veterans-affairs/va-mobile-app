"use strict";(self.webpackChunkdocumentation=self.webpackChunkdocumentation||[]).push([[6086],{9707:function(n,e,t){t.r(e),t.d(e,{contentTitle:function(){return d},default:function(){return p},exampleString:function(){return g},frontMatter:function(){return s},metadata:function(){return f},toc:function(){return l}});var i=t(7462),o=t(3366),r=(t(7294),t(3905)),a=(t(9055),t(8909)),c=["components"],s={},d=void 0,f={unversionedId:"FrontEnd/ComponentsSection/NotificationManger",id:"FrontEnd/ComponentsSection/NotificationManger",isDocsHomePage:!1,title:"NotificationManger",description:"export const exampleString =`return (",source:"@site/docs/FrontEnd/ComponentsSection/NotificationManger.mdx",sourceDirName:"FrontEnd/ComponentsSection",slug:"/FrontEnd/ComponentsSection/NotificationManger",permalink:"/docs/FrontEnd/ComponentsSection/NotificationManger",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"NavigationTabBar",permalink:"/docs/FrontEnd/ComponentsSection/NavigationTabBar"},next:{title:"Pagination",permalink:"/docs/FrontEnd/ComponentsSection/Pagination"}},l=[],g='return (\n    <ActionSheetProvider>\n      <ThemeProvider theme={theme}>\n        <Provider store={store}>\n          <I18nextProvider i18n={i18n}>\n            <NavigationContainer ref={navigationRef} onReady={navOnReady} onStateChange={onNavStateChange}>\n              <NotificationManger>\n                <SafeAreaProvider>\n                  <StatusBar barStyle="light-content" backgroundColor={theme.colors.icon.active} />\n                  <AuthGuard />\n                </SafeAreaProvider>\n              </NotificationManger>\n            </NavigationContainer>\n          </I18nextProvider>\n        </Provider>\n      </ThemeProvider>\n    </ActionSheetProvider>\n  )',u={toc:l,exampleString:g};function p(n){var e=n.components,t=(0,o.Z)(n,c);return(0,r.kt)("wrapper",(0,i.Z)({},u,t,{components:e,mdxType:"MDXLayout"}),(0,r.kt)(a.Z,{componentName:"NotificationManger",example:g,codeString:"import { AuthState, StoreState, registerDevice } from 'store'\nimport { NotificationBackgroundFetchResult, Notifications } from 'react-native-notifications'\nimport { View } from 'react-native'\nimport { useDispatch, useSelector } from 'react-redux'\nimport React, { FC, useEffect, useState } from 'react'\n\n/**\n * notification manager component to handle all push logic\n */\nconst NotificationManger: FC = ({ children }) => {\n  const { loggedIn } = useSelector<StoreState, AuthState>((state) => state.auth)\n  const dispatch = useDispatch()\n  const [eventsRegistered, setEventsRegistered] = useState(false)\n  useEffect(() => {\n    const register = () => {\n      Notifications.events().registerRemoteNotificationsRegistered((event) => {\n        console.debug('Device Token Received', event.deviceToken)\n        dispatch(registerDevice(event.deviceToken))\n      })\n      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {\n        //TODO: Log this error in crashlytics?\n        console.error(event)\n        dispatch(registerDevice())\n      })\n      Notifications.registerRemoteNotifications()\n    }\n\n    if (loggedIn) {\n      register()\n    }\n  }, [dispatch, loggedIn])\n\n  const registerNotificationEvents = () => {\n    // Register callbacks for notifications that happen when the app is in the foreground\n    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {\n      console.debug('Notification Received - Foreground', notification)\n      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.\n      completion({ alert: true, sound: true, badge: true })\n    })\n\n    // Register callback for opened notifications\n    Notifications.events().registerNotificationOpened((notification, completion) => {\n      /** this should be logged in firebase automatically. Anything here should be actions the app takes when it\n       * opens like deep linking, etc\n       */\n      console.debug('Notification opened by device user', notification)\n      console.debug(`Notification opened with an action identifier: ${notification.identifier}`)\n      completion()\n    })\n\n    // Register callbacks for notifications that happen when the app is in the background\n    Notifications.events().registerNotificationReceivedBackground((notification, completion) => {\n      console.debug('Notification Received - Background', notification)\n      // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.\n      completion(NotificationBackgroundFetchResult.NEW_DATA)\n    })\n\n    // Callback in case there is need to do something with initial notification before it goes to system tray\n    Notifications.getInitialNotification()\n      .then((notification) => {\n        console.debug('Initial notification was:', notification || 'N/A')\n      })\n      .catch((err) => console.error('getInitialNotification() failed', err))\n  }\n\n  if (!eventsRegistered) {\n    registerNotificationEvents()\n    setEventsRegistered(true)\n  }\n\n  const s = { flex: 1 }\n  return <View style={s}>{children}</View>\n}\n\nexport default NotificationManger\n",mdxType:"ComponentTopInfo"}))}p.isMDXComponent=!0}}]);