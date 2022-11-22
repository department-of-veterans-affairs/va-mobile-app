import { NativeModules } from 'react-native'

const inAppUpdate = NativeModules.RNInAppUpdate

/**
 * Function requests the store version from the device app store
 * @returns promise<string>- returns string
 */
export const requestStoreVersion = async (): Promise<string> => {
  const version = await inAppUpdate.requestStoreVersion()
  return version
}

export const requestStorePopup = async (): Promise<boolean> => {
  const popup = await inAppUpdate.requestStorePopup()
  return popup
}
