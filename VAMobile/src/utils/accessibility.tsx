import { isIOS } from './platform'
import getEnv from 'utils/env'

const { IS_TEST } = getEnv()
interface AccessabilityProps {
	accessible?: boolean
	testID?: string
	accessibilityLabel?: string
}
export const testIdProps = (id: string, disableAccessible?: boolean): AccessabilityProps => {
	// ignore test attributes set in this function for dev or prod as it exposes accessibilityLabel to users on android
	if (!IS_TEST) {
		return {}
	}

	const disableAccessibility = disableAccessible ? { accessible: false } : { accessible: undefined }

	if (isIOS()) {
		return { ...disableAccessibility, testID: id }
	}

	return { ...disableAccessibility, accessibilityLabel: id }
}

export const a11yHintProp = (hint: string): { accessibilityHint?: string } => {
	// Remove a11yHints from tests as it can cause querying issues for android integration tests
	if (IS_TEST) {
		return {}
	}

	return {
		accessibilityHint: hint,
	}
}
