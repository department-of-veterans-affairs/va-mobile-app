import { PixelRatio } from 'react-native'

/**
 * Generates testID string for reusable components
 */
export const generateTestID = (value: string, suffix: string): string => {
	// ex. 'My title' -> 'my-title-wide-button'
	const updatedValue = value.toLowerCase().replace(/\s/g, '-')

	if (suffix !== '') {
		return updatedValue + '-' + suffix
	}

	return updatedValue
}

/**
 * Returns a function to calculate 'value' based on fontScale
 */
export const useFontScale = (): Function => {
	return (value: number): number => {
		return PixelRatio.getFontScale() * value
	}
}
