import AsyncStorage from '@react-native-async-storage/async-storage'
import { overrideRemote, devConfig, featureEnabled, activateRemoteConfig, setDebugConfig } from 'utils/remoteConfig'
import { setWaygateDebugConfig, waygateConfig } from './waygateConfig'

const mockGetItem = AsyncStorage.getItem as jest.Mock
const mockSetItem = AsyncStorage.setItem as jest.Mock
const mockSetDefaultsSpy = jest.fn()

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

const mockWaygateOverrides = waygateConfig

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
