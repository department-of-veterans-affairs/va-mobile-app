import { Platform } from 'react-native'

export enum PlatformType {
	ANDROID,
	IOS,
}

export const getPlatform = () => {
	if (Platform.OS === 'ios') {
		return PlatformType.IOS
	}
	return PlatformType.ANDROID
}

export const isIOS = () => {
	return getPlatform() === PlatformType.IOS
}

export const isAndroid = () => {
	return getPlatform() === PlatformType.ANDROID
}
