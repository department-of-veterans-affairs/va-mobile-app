import { AccessibilityProps } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components/native'

import { BoxProps, createBoxStyles } from './Box'
import { VATextColors, VATheme, VATypographyThemeVariants } from 'styles/theme'
import { themeFn } from 'utils/theme'

/** TextView font variants */
export type FontVariant = keyof VATypographyThemeVariants
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

    /** The text transformation */
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'

    /** text decoration */
    textDecoration?: 'none' | 'underline' | 'line-through' | 'underline line-through'

    /** text decoration color */
    textDecorationColor?: ColorVariant
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
  ${themeFn<TextViewProps>((_theme, props) => (props.textTransform ? `text-transform:${props.textTransform};` : ''))}
  ${themeFn<TextViewProps>((_theme, props) => (props.textDecoration ? `text-decoration:${props.textDecoration}` : ''))};
  ${themeFn<TextViewProps>((theme, props) => (props.textDecorationColor ? `text-decoration-color:${theme.colors.text[props.textDecorationColor]}` : ''))};
`

/**
 * Text is an element to quickly style text
 *
 * @returns TextView component
 */
const TextView: FC<TextViewProps> = (props) => {
  const wrapperProps = { ...props }
  return <StyledText {...wrapperProps} selectable={true} />
}

export default TextView
