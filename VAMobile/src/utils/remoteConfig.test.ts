import AsyncStorage from '@react-native-async-storage/async-storage'

import { activateRemoteConfig, devConfig, featureEnabled, overrideRemote, setDebugConfig } from 'utils/remoteConfig'

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
  cernerTrueForDemo: false,
  decisionLettersWaygate: false,
  haptics: false,
  homeScreenPrefetch: false,
  inAppRecruitment: false,
  inAppReview: true,
  inAppUpdates: false,
  patientCheckIn: false,
  patientCheckInWaygate: true,
  preferredNameGenderWaygate: false,
  prescriptions: true,
  submitEvidenceExpansion: true,
  testFeature: false,
  whatsNewUI: false,
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
    expect(mockSetItem).toHaveBeenCalledWith('@store_remote_config_overrides', JSON.stringify(mockOverrides))
    expect(overrideRemote).toBe(true)
    expect(featureEnabled('testFeature')).toBe(false)
  })
})
