import { isIOS } from "./platform"

interface AccessabilityProps {
	accessible?: boolean
	testID?: string
	accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean): AccessabilityProps => {
	const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

	if (isIOS()) {
		return { ...disableAccessibility, testID: id }
	}

	return { ...disableAccessibility, accessibilityLabel: id }
}
