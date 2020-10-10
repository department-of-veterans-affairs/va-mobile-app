import { PixelRatio } from 'react-native'
import { ThemeContext } from 'styled-components'
import { useContext } from 'react'

import { VATheme } from 'styles/theme'

/**
 * Returns a function to calculate 'value' based on fontScale
 */
export const useFontScale = (): ((val: number) => number) => {
	return (value: number): number => {
		return PixelRatio.getFontScale() * value
	}
}

/**
 * Hook to get the theme in a component
 */
export const useTheme = (): VATheme => {
	return useContext<VATheme>(ThemeContext)
}
