import { Platform, PlatformIOSStatic } from 'react-native'

export enum PlatformType {
  ANDROID,
  IOS,
}

export const getPlatform = (): PlatformType => {
  if (Platform.OS === 'ios') {
    return PlatformType.IOS
  }
  return PlatformType.ANDROID
}

export const isIOS = (): boolean => {
  return getPlatform() === PlatformType.IOS
}

export const isIpad = () => isIOS() && (Platform as PlatformIOSStatic).isPad

export const isAndroid = (): boolean => {
  return getPlatform() === PlatformType.ANDROID
}
