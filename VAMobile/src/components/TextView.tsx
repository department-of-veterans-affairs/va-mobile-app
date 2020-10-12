import { AccessibilityProps } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { BoxProps, createBoxStyles } from './Box'
import { VATextColors, VATheme, VATypographyThemeVariants } from 'styles/theme'
import { themeFn } from 'utils/theme'

type FontVariant = keyof VATypographyThemeVariants
type ColorVariant = keyof VATextColors

/**
 * Props for textView
 */
export type TextViewProps = AccessibilityProps &
	BoxProps & {
		/** Defaults to primary text */
		color?: ColorVariant

		/** Defaults to regular */
		variant?: FontVariant
	}

const getColor = (theme: VATheme, props: TextViewProps): string => {
	return theme.colors.text[props.color as keyof VATextColors] || theme.colors.text.primary
}

const getFontFamily = (theme: VATheme, props: TextViewProps): string => {
	return theme.typography[props.variant as keyof VATypographyThemeVariants] || theme.typography.MobileBody
}

const StyledText = styled.Text`
	${themeFn<TextViewProps>(getFontFamily)}
	color: ${themeFn<TextViewProps>(getColor)};
	${themeFn<TextViewProps>((theme, props) => createBoxStyles(theme, props))};
`

/**
 * Text is an element to quickly style text
 *
 * @returns TextView component
 */
const TextView: FC<TextViewProps> = (props) => {
	const wrapperProps = { ...props }
	return <StyledText {...wrapperProps} />
}

export default TextView
