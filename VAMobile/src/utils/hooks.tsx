import { PixelRatio } from 'react-native'
import { ReactNode, useContext } from 'react'
import { ThemeContext } from 'styled-components'
import React from 'react'

import { BackButton } from 'components'
import { StackHeaderLeftButtonProps, StackNavigationOptions } from '@react-navigation/stack'
import { VATheme } from 'styles/theme'
import { getHeaderStyles } from 'styles/common'

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

/**
 * Hook to get the current header styles in a component
 */
export const useHeaderStyles = (): StackNavigationOptions => {
	let headerStyles = getHeaderStyles(useTheme())

	headerStyles = {
		...headerStyles,
		headerLeft: (props: StackHeaderLeftButtonProps): ReactNode => <BackButton onPress={props.onPress} canGoBack={props.canGoBack} displayText={'back'} showCarat={true} />,
	}
	return headerStyles
}
