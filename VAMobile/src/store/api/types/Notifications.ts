/** constant value for push api os names */
export const PushOsName: {
  ios: PushOs
  android: PushOs
} = {
  ios: 'ios',
  android: 'android',
}

/** union type for push os name strings */
export type PushOs = 'android' | 'ios'

/** constant string for push api app name */
export const PUSH_APP_NAME = 'va_mobile_app'

/** api type for registering device for push notifications api */
export type PushRegistration = {
  deviceToken: string
  osName: PushOs
  deviceName: string
  appName: string
  debug: boolean
}

/** api response type for push registration */
export type PushRegistrationResponse = {
  data: {
    type: string
    id: string
    attributes: {
      endpointSid: string
    }
  }
}

/** type for preferences in the api */
export type PushPreference = {
  preferenceId: string
  preferenceName: string
  value: boolean
}

/** param type for changing push settings in api */
export type PushPreferenceParam = {
  preference: string
  enabled: boolean
}

/** api response type for push preferences get */
export type GetPushPrefsResponse = {
  data: {
    id: string
    type: string
    attributes: {
      preferences: PushPreference[]
    }
  }
}
