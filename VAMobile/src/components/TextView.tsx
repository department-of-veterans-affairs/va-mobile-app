import { AccessibilityProps } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { VATheme } from 'styles/theme'
import { themeFn } from 'utils/theme'
import { useFontScale } from 'utils/common'

type StyledTextProps = AccessibilityProps & {
	variant?: FontVariant
	fontSize: number
}

const getFontFamily = (theme: VATheme, props: StyledTextProps): string => {
	switch (props.variant) {
		case 'bold':
			return theme.fontFace.bold
		case 'altBold':
			return theme.fontFace.altBold
		case 'system':
			return 'System'
		default:
			return theme.fontFace.regular
	}
}

const StyledText = styled.Text`
	${themeFn<StyledTextProps>(getFontFamily)}
	font-size: ${themeFn<StyledTextProps>((_theme, props) => props.fontSize)}px;
`

type FontVariant = 'system' | 'regular' | 'bold' | 'altBold'

/**
 * Props for textView
 */
export type TextViewProps = AccessibilityProps & {
	/** Defaults to 16 */
	fontSize?: number

	/** Defaults to regular */
	variant?: FontVariant
}

/**
 * Text is an element to quickly style text
 *
 * @returns CtaButton component
 */
const TextView: FC<TextViewProps> = (props) => {
	const fs = useFontScale()
	const fontSize = fs(props.fontSize || 16)
	const wrapperProps: StyledTextProps = { ...props, fontSize }
	return <StyledText {...wrapperProps} />
}

export default TextView
