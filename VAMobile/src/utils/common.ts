// Generates testID
export const generateTestID = (value: string, suffix: string): string => {
	// ex. 'My title' -> 'my-title-wide-button'
	const updatedValue = value.toLowerCase().replace(/\s/g, '-')

	if (suffix !== '') {
		return updatedValue + '-' + suffix
	}

	return updatedValue
}
