import { PixelRatio } from 'react-native'

/**
 * Generates testID string for reusable components
 */
export const generateTestID = (value: string, suffix: string): string => {
	// ex. 'My title' -> 'my-title-wide-button'
	return value.toLowerCase().replace(/\s/g, '-') + '-' + suffix
}

/**
 * Returns a fontScaled version of the value passed in based on user font-size preferences in settings.
 */
export const useFontScale = (value: number): number => {
	return PixelRatio.getFontScale() * value
}
