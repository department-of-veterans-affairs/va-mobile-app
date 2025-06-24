import { NativeModules } from 'react-native'

import { requestStorePopup, requestStoreVersion } from './rnInAppUpdate'

const inAppUpdate = NativeModules.RNInAppUpdate

describe('requestStoreVersion', () => {
  it('should call the native module and return the version', async () => {
    const version = await requestStoreVersion()
    expect(inAppUpdate.requestStoreVersion).toHaveBeenCalled()
    expect(version).toBe('2.0.0')
  })
})

describe('requestStorePopup', () => {
  it('should resolve true when the native module returns true', async () => {
    // Mock native module to return true, i.e., user clicked 'Ok' on popup
    NativeModules.RNInAppUpdate.requestStorePopup.mockResolvedValue(true)

    const popupSelectionResult = await requestStorePopup()
    expect(inAppUpdate.requestStorePopup).toHaveBeenCalled()
    expect(popupSelectionResult).toBe(true)
  })

  it('should resolve false when the native module returns false', async () => {
    // Mock native module to return true, i.e., user clicked 'Cancel' on popup
    NativeModules.RNInAppUpdate.requestStorePopup.mockResolvedValue(false)

    const popupSelectionResult = await requestStorePopup()
    expect(inAppUpdate.requestStorePopup).toHaveBeenCalled()
    expect(popupSelectionResult).toBe(false)
  })
})
