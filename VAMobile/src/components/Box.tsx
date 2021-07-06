import { FlexAlignType, View, ViewProps } from 'react-native'
import { VAAlertBoxColors, VABackgroundColors, VABorderColors, VAButtonBackgroundColors, VAButtonBorderColors, VATheme } from 'styles/theme'
import React, { FC, ReactNode } from 'react'
import _ from 'underscore'
import styled from 'styled-components'

import { themeFn } from 'utils/theme'

type VABackgroundColorsVariant = keyof VABackgroundColors
type VAAlertBoxColorsVariant = keyof VAAlertBoxColors
type VAButtonBackgroundColorsVariant = keyof VAButtonBackgroundColors
export type BackgroundVariant = VABackgroundColorsVariant | VAAlertBoxColorsVariant | VAButtonBackgroundColorsVariant

type VABorderColorsVariant = keyof VABorderColors
type VAButtonBorderColorsVariant = keyof VAButtonBorderColors
export type BorderColorVariant = VABorderColorsVariant | VAButtonBackgroundColorsVariant
export type BorderStyles = 'none' | 'dotted' | 'solid' | 'dashed'
export type BorderWidths = 'default' | number

// assume strings are coming back as `<number>px`
type NumOrStrPx = number | string

export type BoxProps = ViewProps & {
  m?: NumOrStrPx
  mt?: NumOrStrPx
  mr?: NumOrStrPx
  mb?: NumOrStrPx
  ml?: NumOrStrPx
  mx?: NumOrStrPx | 'auto'
  my?: NumOrStrPx
  p?: NumOrStrPx
  pt?: NumOrStrPx
  pr?: NumOrStrPx
  pb?: NumOrStrPx
  pl?: NumOrStrPx
  px?: NumOrStrPx
  py?: NumOrStrPx
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  position?: 'relative' | 'absolute'
  display?: 'flex' | 'none'
  flex?: number
  flexGrow?: number
  flexShrink?: number
  flexWrap?: 'wrap' | 'nowrap' | 'wrap-reverse'
  overflow?: 'hidden' | 'visible' | 'scroll'
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-between'
  alignItems?: 'center' | 'flex-start' | 'flex-end'
  alignSelf?: 'auto' | FlexAlignType
  children?: ReactNode
  width?: number | string
  minWidth?: number | string
  height?: number | string
  minHeight?: number | string
  flexDirection?: 'column' | 'row'
  textAlign?: 'center' | 'left' | 'right'
  backgroundColor?: BackgroundVariant
  opacity?: number
  borderWidth?: BorderWidths
  borderColor?: BorderColorVariant
  borderStyle?: BorderStyles
  borderBottomWidth?: BorderWidths
  borderBottomColor?: BorderColorVariant
  borderTopWidth?: BorderWidths
  borderTopColor?: BorderColorVariant
  borderRightWidth?: BorderWidths
  borderRightColor?: BorderColorVariant
  borderLeftWidth?: BorderWidths
  borderLeftColor?: BorderColorVariant
  borderRadius?: number | string
}

const toDimen = (val?: string | number): string | undefined => {
  if (val === undefined || val === null) {
    return
  }
  if (_.isFinite(val)) {
    return `${val}px`
  }
  return `${val}`
}

const generateBoxStyles = (
  s: 'margin' | 'padding',
  a?: NumOrStrPx,
  t?: NumOrStrPx,
  l?: NumOrStrPx,
  r?: NumOrStrPx,
  b?: NumOrStrPx,
  x?: NumOrStrPx | 'auto',
  y?: NumOrStrPx,
): { [key: string]: string | undefined } => {
  const styles: { [key: string]: string | undefined } = {}

  styles[`${s}-top`] = toDimen(t)
  styles[`${s}-right`] = toDimen(r)
  styles[`${s}-bottom`] = toDimen(b)
  styles[`${s}-left`] = toDimen(l)

  if (a) {
    styles[s] = toDimen(a)
  }

  if (x) {
    const xDimen = toDimen(x)
    if (xDimen === 'auto') {
      styles[`${s}-left`] = 'auto'
      styles[`${s}-right`] = 'auto'
    } else {
      styles[`${s}-left`] = xDimen
      styles[`${s}-right`] = xDimen
    }
  }

  if (y) {
    styles[`${s}-top`] = toDimen(y)
    styles[`${s}-bottom`] = toDimen(y)
  }

  return styles
}

const getBackgroundColor = (theme: VATheme, bgVariant: BackgroundVariant | undefined): string => {
  if (!bgVariant) {
    return 'transparent'
  }
  return (
    theme.colors.background[bgVariant as VABackgroundColorsVariant] ||
    theme.colors.alertBox[bgVariant as VAAlertBoxColorsVariant] ||
    theme.colors.buttonBackground[bgVariant as VAButtonBackgroundColorsVariant]
  )
}

const generateBorderStyles = (
  theme: VATheme,
  direction: '' | 'top' | 'bottom' | 'left' | 'right',
  width?: BorderWidths,
  style?: BorderStyles,
  color?: BorderColorVariant,
): { [key: string]: string } => {
  const styles: { [key: string]: string } = {}
  const dir = direction !== '' ? `-${direction}` : ''

  if (width) {
    styles[`border${dir}-width`] = _.isFinite(width) ? `${width}px` : `${theme.dimensions.borderWidth}px`
  }

  if (style) {
    styles['border-style'] = style
  }

  if (color) {
    styles[`border${dir}-color`] = theme.colors.border[color as VABorderColorsVariant] || theme.colors.buttonBorder[color as VAButtonBorderColorsVariant]
  }
  return styles
}

export const createBoxStyles = (theme: VATheme, props: BoxProps): string => {
  const { m, mt, ml, mr, mb, mx, my } = props
  const mStyles = generateBoxStyles('margin', m, mt, ml, mr, mb, mx, my)
  const { p, pt, pl, pr, pb, px, py } = props
  const pStyles = generateBoxStyles('padding', p, pt, pl, pr, pb, px, py)

  const { borderWidth, borderStyle, borderColor } = props
  const borderStyles = generateBorderStyles(theme, '', borderWidth, borderStyle, borderColor)
  const { borderTopWidth, borderTopColor } = props
  const btStyles = generateBorderStyles(theme, 'top', borderTopWidth, borderStyle, borderTopColor)
  const { borderBottomWidth, borderBottomColor } = props
  const bbStyles = generateBorderStyles(theme, 'bottom', borderBottomWidth, borderStyle, borderBottomColor)
  const { borderLeftWidth, borderLeftColor } = props
  const blStyles = generateBorderStyles(theme, 'left', borderLeftWidth, borderStyle, borderLeftColor)
  const { borderRightWidth, borderRightColor } = props
  const brStyles = generateBorderStyles(theme, 'right', borderRightWidth, borderStyle, borderRightColor)

  const styles = {
    position: props.position,
    top: toDimen(props.top),
    left: toDimen(props.left),
    right: toDimen(props.right),
    bottom: toDimen(props.bottom),
    display: props.display,
    'justify-content': props.justifyContent,
    'align-items': props.alignItems,
    'align-self': props.alignSelf,
    width: typeof props.width === 'number' ? `${props.width}px` : props.width,
    minWidth: typeof props.minWidth === 'number' ? `${props.minWidth}px` : props.minWidth,
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
    minHeight: typeof props.minHeight === 'number' ? `${props.minHeight}px` : props.minHeight,
    flex: props.flex,
    'flex-direction': props.flexDirection,
    'flex-shrink': props.flexShrink,
    'flex-grow': props.flexGrow,
    'flex-wrap': props.flexWrap,
    'text-align': props.textAlign,
    overflow: props.overflow,
    ...mStyles,
    ...pStyles,
    'background-color': getBackgroundColor(theme, props.backgroundColor),
    opacity: props.opacity,
    ...borderStyles,
    ...btStyles,
    ...bbStyles,
    ...blStyles,
    ...brStyles,
    'border-radius': typeof props.borderRadius === 'number' ? `${props.borderRadius}px` : props.borderRadius,
  }

  return _.map(styles, (v, k) => {
    if (v === undefined) {
      return undefined
    }
    return `${k}:${v}`
  })
    .filter((line) => line !== undefined)
    .join(';\n')
}

const StyledBox = styled(View)`
  ${themeFn<BoxProps>((theme, props) => createBoxStyles(theme, props))};
`
/**
 * Text is an element to quickly style text
 *
 * @returns TextView component
 */
const Box: FC<BoxProps> = (props) => {
  return <StyledBox {...props} />
}

export default Box
