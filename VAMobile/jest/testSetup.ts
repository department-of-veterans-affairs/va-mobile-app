import { NativeModules } from 'react-native'

const globalAny: any = global

NativeModules.RNCheckVoiceOver = {
  isVoiceOverRunning: jest.fn(() => Promise.resolve({ data: false })),
}

NativeModules.RNAuthSession = {
  beginAuthSession: jest.fn(() => Promise.resolve('vamobile://login-success?code=123&state=5434')),
}

NativeModules.DeviceData = {
  deviceName: 'Device Name',
  getDeviceName: jest.fn().mockReturnValue('Device Name'),
  versionName: 'v0.0.0',
  getVersionName: jest.fn().mockReturnValue('v0.0.0'),
  buildNumber: 0,
  getBuildNumber: jest.fn().mockReturnValue(0),
}

NativeModules.RNInAppUpdate = {
  storeVersion: '2.0.0',
  requestStoreVersion: jest.fn().mockReturnValue('2.0.0'),
}

NativeModules.SettingsManager = {
  ...NativeModules.SettingsManager,
  settings: {AppleLocale: 'en_US'}
}

NativeModules.I18nManager = {
  ...NativeModules.I18nManager,
  localeIdentifier: 'en_US'
}

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Linking/Linking', () => {
  return {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    openURL: jest.fn(() => Promise.resolve('')),
  }
})

jest.mock('../src/store/api', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  del: jest.fn(),
  setAccessToken: jest.fn(),
  getAccessToken: jest.fn(),
  setRefreshToken: jest.fn(),
}))

jest.mock('../src/utils/hooks', () => {
  let original = jest.requireActual('../src/utils/hooks')

  return {
    ...original,
    useRouteNavigation: () => {
      return jest.fn()
    },
  }
})

jest.mock('../src/utils/platform', () => {
  let original = jest.requireActual('../src/utils/platform')
  return {
    ...original,
    isAndroid: jest.fn(),
  }
})

jest.mock('react-native-keychain', () => {
  return {
    ACCESS_CONTROL: {
      USER_PRESENCE: 'USER_PRESENCE',
      BIOMETRY_ANY: 'BIOMETRY_ANY',
      BIOMETRY_CURRENT_SET: 'BIOMETRY_CURRENT_SET',
      DEVICE_PASSCODE: 'DEVICE_PASSCODE',
      APPLICATION_PASSWORD: 'APPLICATION_PASSWORD',
      BIOMETRY_ANY_OR_DEVICE_PASSCODE: 'BIOMETRY_ANY_OR_DEVICE_PASSCODE',
      BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE: 'BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE',
    },
    BIOMETRY_TYPE: {
      TOUCH_ID: 'TouchID',
      FACE_ID: 'FaceID',
      FINGERPRINT: 'Fingerprint',
      FACE: 'Face',
      IRIS: 'Iris',
    },
    AUTHENTICATION_TYPE: {
      DEVICE_PASSCODE_OR_BIOMETRICS: 'AuthenticationWithBiometricsDevicePasscode',
      BIOMETRICS: 'AuthenticationWithBiometrics',
    },
    ACCESSIBLE: {
      WHEN_UNLOCKED: 'AccessibleWhenUnlocked',
      AFTER_FIRST_UNLOCK: 'AccessibleAfterFirstUnlock',
      ALWAYS: 'AccessibleAlways',
      WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: 'AccessibleWhenPasscodeSetThisDeviceOnly',
      WHEN_UNLOCKED_THIS_DEVICE_ONLY: 'AccessibleWhenUnlockedThisDeviceOnly',
      AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY: 'AccessibleAfterFirstUnlockThisDeviceOnly',
      ALWAYS_THIS_DEVICE_ONLY: 'AccessibleAlwaysThisDeviceOnly',
    },
    SECURITY_LEVEL: {
      SECURE_SOFTWARE: 'SECURE_SOFTWARE',
      SECURE_HARDWARE: 'SECURE_HARDWARE',
      ANY: 'ANY',
    },
    SECURITY_LEVEL_ANY: 'MOCK_SECURITY_LEVEL_ANY',
    SECURITY_LEVEL_SECURE_SOFTWARE: 'MOCK_SECURITY_LEVEL_SECURE_SOFTWARE',
    SECURITY_LEVEL_SECURE_HARDWARE: 'MOCK_SECURITY_LEVEL_SECURE_HARDWARE',
    setGenericPassword: jest.fn(() => Promise.resolve()),
    getGenericPassword: jest.fn(() => Promise.resolve(undefined)),
    resetGenericPassword: jest.fn(() => Promise.resolve()),
    getSupportedBiometryType: jest.fn(() => Promise.resolve(undefined)),
    setInternetCredentials: jest.fn(() => Promise.resolve()),
    getInternetCredentials: jest.fn(() => Promise.resolve(undefined)),
    resetInternetCredentials: jest.fn(() => Promise.resolve()),
    hasInternetCredentials: jest.fn(() => Promise.resolve(false)),
  }
})

jest.mock('react-native-localize', () => {
  return {
    getLocales: jest.fn(),
    findBestAvailableLanguage: jest.fn(() => ['en']),
  }
})

jest.mock('@react-native-async-storage/async-storage', () => {
  return {
    setItem: jest.fn(() => Promise.resolve()),
    getItem: jest.fn(() => Promise.resolve()),
    removeItem: jest.fn(() => Promise.resolve()),
  }
})

jest.mock('@react-native-cookies/cookies', () => {
  return {
    clearAll: jest.fn(),
  }
})

jest.mock('@react-native-community/clipboard', () => {
  return {
    setString: jest.fn(),
  }
})

jest.mock('@react-navigation/native', () => {
  const original = jest.requireActual('@react-navigation/native')
  return {
    ...original,
    useFocusEffect: () => jest.fn(),
  }
})

jest.mock('rn-fetch-blob', () => {
  return {
    fs: {
      dirs: {
        DocumentDir: 'DocumentDir',
      },
    },
    config: jest.fn(({ path }) => {
      return {
        fetch: jest.fn(() => {
          return Promise.resolve({
            path: () => {
              return path
            },
            respInfo: {
              status: 200,
            },
          })
        }),
      }
    }),
  }
})

jest.mock('react-native-file-viewer', () => {
  return {
    open: jest.fn(),
  }
})

jest.mock('@react-native-firebase/analytics', () => {
  return jest.fn(() => {
    return {
      logScreenView: jest.fn(() => Promise.resolve()),
      logEvent: jest.fn(() => Promise.resolve()),
      setUserProperty: jest.fn(() => Promise.resolve()),
      setUserProperties: jest.fn(() => Promise.resolve()),
      setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
    }
  })
})

jest.mock('@react-native-firebase/crashlytics', () => () => ({
  recordError: jest.fn(),
  logEvent: jest.fn(),
  setUserProperties: jest.fn(),
  setUserId: jest.fn(),
  setCurrentScreen: jest.fn(),
  setCrashlyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
}))

jest.mock('@react-native-firebase/app', () => {
  return {
    utils: () => {
      return {
        isRunningInTestLab: false,
      }
    },
  }
})

globalAny.fetch = jest.fn(() =>
  Promise.reject({
    status: 999,
    text: () => Promise.resolve('NOT MOCKED'),
    json: () => Promise.resolve({ error: 'NOT MOCKED' }),
  }),
)

jest.mock('react-native-notifications', () => {
  return {
    Notifications: {
      events: jest.fn(() => {
        return {
          registerRemoteNotificationsRegistered: jest.fn(),
          registerRemoteNotificationsRegistrationFailed: jest.fn(),
          registerNotificationReceivedForeground: jest.fn(),
          registerNotificationOpened: jest.fn(),
          registerNotificationReceivedBackground: jest.fn(),
        }
      }),
      getInitialNotification: jest.fn(() => {
        return Promise.resolve()
      }),
    },
  }
})

globalAny.FormData = () => ({
  append: jest.fn(),
})

globalAny.snackBar = {
  show: jest.fn(),
  hideAll: jest.fn(),
}

jest.mock('@react-native-firebase/perf', () => {
  return jest.fn(() => {
    return {
      setPerformanceCollectionEnabled: jest.fn(() => Promise.resolve()),
    }
  })
})

jest.mock('@react-native-firebase/remote-config', () => {
  return jest.fn(() => {
    return {
      setDefaults: jest.fn(() => Promise.resolve()),
      activate: jest.fn(() => Promise.resolve()),
      fetch: jest.fn(() => Promise.resolve()),
      getValue: jest.fn(() => ({
        asBoolean: () => false,
      })),
      getAll: jest.fn(() => false),
    }
  })
})

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('utils/homeScreenAlerts', () => {
  return {
    FeatureConstants: jest.fn(),
    getVersionSkipped: jest.fn(),
    getStoreVersion: jest.fn(),
    getLocalVersion: jest.fn(),
  }
})

jest.mock('react-native-webview', () => {
  const { View } = require('react-native')
  return {
    WebView: View,
  }
})
