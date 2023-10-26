import AsyncStorage from '@react-native-async-storage/async-storage'
import { overrideRemote, devConfig, featureEnabled, activateRemoteConfig, setDebugConfig, getFeatureToggles, setWaygateDebugConfig } from 'utils/remoteConfig'

const mockGetItem = AsyncStorage.getItem as jest.Mock
const mockSetItem = AsyncStorage.setItem as jest.Mock
const mockSetDefaultsSpy = jest.fn()

jest.mock('@react-native-firebase/remote-config', () => () => ({
  fetch: jest.fn(() => Promise.resolve()),
  getValue: jest.fn(() => ({
    asBoolean: () => true,
  })),
  getAll: jest.fn(() => false),
  activate: jest.fn(() => Promise.resolve()),
  setConfigSettings: jest.fn(() => Promise.resolve()),
  setDefaults: mockSetDefaultsSpy,
}))

const mockOverrides = {
  appointmentRequests: true,
  prescriptions: true,
  SIS: true,
  testFeature: false,
  inAppUpdates: false,
  preferredNameGenderWaygate: false,
  haptics: false,
  whatsNewUI: false,
  decisionLettersWaygate: false,
  patientCheckIn: false,
  patientCheckInWaygate: true,
}

const mockWaygateOverrides = {
  WG_HomeScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ProfileScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_PersonalInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_HowDoIUpdateScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_PreferredNameScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_GenderIdentityScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_WhatToKnowScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ContactInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_HowWillYouScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditAddressScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditPhoneNumberScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_EditEmailScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_MilitaryInformationScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_IncorrectServiceInfoScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_SettingsScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ManageYourAccountScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_NotificationsSettingsScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_ContactVAScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_VeteransCrisisLineScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_VeteranStatusScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
  WG_LoginScreen: {
    enabled: true,
    errorMsgTitle: undefined,
    errorMsgBody: undefined,
    appUpdateButton: false,
    allowFunction: false,
    denyAccess: false,
  },
}

describe('activate', () => {
  it('should call setDefaults with devConfig', async () => {
    await activateRemoteConfig()
    expect(mockSetDefaultsSpy).toHaveBeenCalledWith(devConfig)

    // Should check AsyncStorage for overrides
    expect(mockGetItem).toHaveBeenCalledWith('@store_remote_config_overrides')
  })

  it('should set overrideRemote to true and save overrides to AsyncStorage', async () => {
    expect(overrideRemote).toBe(false)
    expect(featureEnabled('testFeature')).toBe(true)
    await setDebugConfig(mockOverrides)
    await setWaygateDebugConfig(mockWaygateOverrides)
    expect(mockSetItem).toHaveBeenCalledWith('@store_remote_config_overrides', JSON.stringify(mockOverrides))
    expect(overrideRemote).toBe(true)
    expect(featureEnabled('testFeature')).toBe(false)
  })
})
