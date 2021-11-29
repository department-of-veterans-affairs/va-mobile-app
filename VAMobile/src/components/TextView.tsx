import { AccessibilityProps, Pressable, Text } from 'react-native'
import { useSelector } from 'react-redux'
import React, { FC } from 'react'
import styled from 'styled-components'

import { AccessibilityState, StoreState } from 'store'
import { BoxProps, createBoxStyles } from './Box'
import { VAButtonTextColors, VATextColors, VATheme, VATypographyThemeVariants } from 'styles/theme'
import { themeFn } from 'utils/theme'
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
  }

const getColor = (theme: VATheme, props: TextViewProps): string => {
  return theme.colors.text[props.color as keyof VATextColors] || theme.colors.buttonText[props.color as keyof VAButtonTextColors] || theme.colors.text.primary
}

const getFontFamily = (theme: VATheme, props: TextViewProps): string => {
  return theme.typography[props.variant as keyof VATypographyThemeVariants] || theme.typography.MobileBody
}

const getTextDecorationColor = (theme: VATheme, props: TextViewProps): string => {
  return theme.colors.text[props.textDecorationColor as keyof VATextColors] || theme.colors.buttonText[props.textDecorationColor as keyof VAButtonTextColors] || ''
}

const StyledText = styled(Text)`
  ${themeFn<TextViewProps>(getFontFamily)}
  color: ${themeFn<TextViewProps>(getColor)};
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
const TextView: FC<TextViewProps> = (props) => {
  const { isVoiceOverTalkBackRunning } = useSelector<StoreState, AccessibilityState>((state) => state.accessibility)
  const theme = useTheme()
  const wrapperProps = { ...props }

  if (wrapperProps.onPress) {
    const { onPress, ...remainingProps } = wrapperProps
    return (
      <Pressable onPress={onPress} accessible={false}>
        <StyledText {...remainingProps} />
      </Pressable>
    )
  }

  const selectToCopyProps = isVoiceOverTalkBackRunning ? {} : { selectable: true, selectionColor: theme.colors.selectCopyText }

  return <StyledText {...selectToCopyProps} {...wrapperProps} />
}

export default TextView
