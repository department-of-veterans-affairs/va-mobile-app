import { AccessibilityProps, Pressable, Text } from 'react-native'
import React, { FC } from 'react'
import styled from 'styled-components'

import { AccessibilityState } from 'store/slices/accessibilitySlice'
import { BoxProps, createBoxStyles } from './Box'
import { RootState } from 'store'
import { VAButtonTextColors, VATextColors, VATheme, VATypographyThemeVariants } from 'styles/theme'
import { themeFn } from 'utils/theme'
import { useSelector } from 'react-redux'
import { useTheme } from 'utils/hooks'

/** TextView font variants */
export type FontVariant = keyof VATypographyThemeVariants
export type ColorVariant = keyof VATextColors | keyof VAButtonTextColors

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

    /** onPress callback */
    onPress?: () => void

    /** if false font won't scale if screen font size changes */
    allowFontScaling?: boolean

    /** if true the text will be selectable */
    selectable?: boolean

    /** if set, sets the number of lines the text will render on. if the text exceeds the line amount, it will ellipsis */
    numberOfLines?: number

    /** Max size for font when user adjusts their font scaling */
    maxFontSizeMultiplier?: number

    /** if true apply paragraphSpacing, it overrides the mb if supplied*/
    paragraphSpacing?: boolean

    /** Optional TestID */
    testID?: string
  }

const getColor = (theme: VATheme, props: TextViewProps): string => {
  return theme.colors.text[props.color as keyof VATextColors] || theme.colors.buttonText[props.color as keyof VAButtonTextColors] || ''
}

const getFontFamily = (theme: VATheme, props: TextViewProps): string => {
  return theme.typography[props.variant as keyof VATypographyThemeVariants] || theme.typography.MobileBody
}

/** function to get fontsize from variant string:
 *  1.It matches to the part font-size:..px in the string and extracts that part out for the next step
 *  2.It then replaces all non number instances with an empty string
 *  3.The + operator coerces it to a number type so that we can use it to multiply and get the spacing needed
 */
const getFontSize = (variant: string) => {
  return +(
    variant
      .match(/font-size:..px/)
      ?.toString()
      .replace(/[^0-9]/g, '') || 0
  )
}

const getTextDecorationColor = (theme: VATheme, props: TextViewProps): string => {
  return theme.colors.text[props.textDecorationColor as keyof VATextColors] || theme.colors.buttonText[props.textDecorationColor as keyof VAButtonTextColors] || ''
}

const StyledText = styled(Text)`
  ${themeFn<TextViewProps>(getFontFamily)}
  ${themeFn<TextViewProps>((theme, props) => (props.color ? `color:${getColor(theme, props)};` : ''))}
  ${themeFn<TextViewProps>((theme, props) => createBoxStyles(theme, props))};
  ${themeFn<TextViewProps>((_theme, props) => (props.textTransform ? `text-transform:${props.textTransform};` : ''))}
  ${themeFn<TextViewProps>((_theme, props) => (props.textDecoration ? `text-decoration:${props.textDecoration}` : ''))};
  ${themeFn<TextViewProps>((theme, props) => (props.textDecorationColor ? `text-decoration-color:${getTextDecorationColor(theme, props)}` : ''))};
`

/**
 * A common component for styling text in the application. It also conforms to the Box properties so you don't need to wrap it with a Box view for margins / paddings
 *
 * @returns TextView component
 */
const TextView: FC<TextViewProps> = ({ selectable = false, paragraphSpacing = false, testID, ...props }) => {
  const { isVoiceOverTalkBackRunning } = useSelector<RootState, AccessibilityState>((state) => state.accessibility)
  const theme = useTheme()
  const wrapperProps = { ...props }

  if (paragraphSpacing) {
    const variant = getFontFamily(theme, wrapperProps)
    const fontSize = getFontSize(variant)
    wrapperProps.mb = fontSize * 2
  }

  if (wrapperProps.onPress) {
    const { onPress, ...remainingProps } = wrapperProps
    return (
      <Pressable onPress={onPress} accessible={false}>
        <StyledText testID={testID} {...remainingProps} />
      </Pressable>
    )
  }

  const selectToCopyProps = isVoiceOverTalkBackRunning ? {} : { selectable, selectionColor: theme.colors.selectCopyText }

  return <StyledText testID={testID} {...selectToCopyProps} {...wrapperProps} />
}

export default TextView
