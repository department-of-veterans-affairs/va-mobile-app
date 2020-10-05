// Generates testID
export const generateTestID = (value: string, suffix: string): string => {
	// ex. 'My title' -> 'my-title-wide-button'
	return value.toLowerCase().replace(/\s/g, '-') + '-' + suffix
}
