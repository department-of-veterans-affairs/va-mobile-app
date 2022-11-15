import { NativeModules } from 'react-native'

const storeVersion = NativeModules.RNStoreVersion

/**
 * Function requests the store version from the device app store
 * @returns promise<string>- returns string
 */
export const requestStoreVersion = async (): Promise<string> => {
  const version = await storeVersion.requestStoreVersion()
  return version
}

export const requestStorePopup = async (): Promise<boolean> => {
  const popup = await storeVersion.requestStorePopup()
  return popup
}
