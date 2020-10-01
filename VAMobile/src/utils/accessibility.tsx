import { Platform } from 'react-native'

export const IS_IOS = Platform.OS === 'ios'
export const IS_ANDROID = Platform.OS === 'android'

interface AccessabilityProps {
	accessible?: boolean
	testID?: string
	accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean): AccessabilityProps => {
	const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

	if (IS_IOS) {
		return { ...disableAccessibility, testID: id }
	}

	return { ...disableAccessibility, accessibilityLabel: id }
}
